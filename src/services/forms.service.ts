import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, catchError, filter, lastValueFrom, map, shareReplay, switchMap, tap, throwError } from 'rxjs';

import { components } from '../generated/iprox-forms.interface';
import { ActiveStepData } from '../shared/components/form-builder/form-builder.component';
import { IForm, Step } from '../shared/components/form-builder/models/form.model';
import { mapFormSteps } from '../shared/components/form-builder/utils/form-builder.utils';
import { handleError } from '../utils/error-handler';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private title = inject(Title);

  private baseUrl = '';
  private selectedFormUrl = '';

  error = signal<string | undefined>(undefined);
  selectedFormId = signal<number | undefined>(undefined);

  setFormId(id: number | undefined): void {
    this.selectedFormId.set(id);
  }

  setFormUrl(url: string): void {
    this.selectedFormUrl = url;
  }

  /**
   * Fetch the form guid from the API
   */
  formGuid$: Observable<string> = toObservable(this.selectedFormId).pipe(
    filter((formId) => formId !== undefined),
    tap(() => this.title.setTitle('Loading...')),
    switchMap((formId) => this.http.post<string>(`${this.baseUrl}v1/form/${formId}`, null)),
    catchError((e) => {
      this.title.setTitle('Error!');
      const errorMessage = handleError(e, this.router);
      this.error.set(errorMessage);
      return throwError(() => errorMessage);
    }),
    shareReplay(1),
  );

  selectedFormGuid = toSignal<string>(this.formGuid$);

  /**
   * Fetch the form data using the fetched form guid from the API
   */
  formData$: Observable<IForm> = toObservable(this.selectedFormGuid).pipe(
    filter((formGuid) => formGuid !== undefined),
    switchMap((formGuid) => this.http.get(`${this.baseUrl}v1/form/${formGuid}`)),
    map((response: components['schemas']['FormResultDetailDto']) => mapFormSteps(response)),
    tap((formData) => this.initialStepRouting(formData)),
    catchError((e) => {
      this.title.setTitle('Error!');
      const errorMessage = handleError(e, this.router);
      this.error.set(errorMessage);
      return throwError(() => errorMessage);
    }),
  );

  /**
   * this will handle the browse routing events and user routing events both
   */
  activeStep$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((navEvent) => {
      /** reset the form id to prevent browser cache on browser back button click */
      if ((navEvent as NavigationEnd).url === '/') {
        this.setFormId(undefined);
        return '';
      }

      if ((navEvent as NavigationEnd).url.replace(/^\//, '') !== this.selectedFormUrl) {
        const stepAlias = (navEvent as NavigationEnd).url.split('/').pop() ?? '';
        const formTitle = this.formdata().title ?? '';
        const stepLabel = this.formdata().steps.find(({ alias }: { alias: string }) => alias === stepAlias)?.label;

        this.title.setTitle(`${formTitle} - ${stepLabel}`);

        return stepAlias;
      }

      return '';
    }),
  );

  /**
   * handle the initial routing for the form steps
   * @param formData Form data to initialize the routing
   */
  initialStepRouting(formData: IForm): void {
    const firstStepAlias = formData.steps[0]?.alias ?? '';
    const firstStepLabel = formData.steps[0]?.label ?? '';

    if (this.router.url.replace(/^\//, '') !== this.selectedFormUrl) {
      const stepAlias = this.router.url.split('/').pop();
      const foundStep = formData.steps.find(({ alias }: { alias: string }) => alias === stepAlias);

      if (!foundStep) {
        /** Handling the not-found steps for the selected form */
        this.navigateToActiveStep(firstStepAlias);
      } else {
        /** Handling the incomplete steps for the selected form */
        if (!foundStep?.isComplete) {
          const formSteps = formData.steps;
          const stepIndex = formSteps.findIndex((step: { alias: string }) => step.alias === foundStep?.alias);

          /** Navigate to the step if the previous step is completed */
          if (stepIndex > 0 && formSteps[stepIndex - 1]?.isComplete) {
            this.navigateToActiveStep(foundStep.alias ?? '');
            this.title.setTitle(`${formData.title} - ${foundStep.label}`);
          } else {
            const lastValidStep = formSteps.reduceRight<Step | undefined>((acc, step) => {
              return step.isComplete ? step : acc;
            }, undefined);

            this.navigateToActiveStep(lastValidStep?.alias ?? firstStepAlias);
            this.title.setTitle(`${formData.title} - ${lastValidStep?.label ?? firstStepLabel}`);
          }
        } else {
          this.navigateToActiveStep(foundStep.alias ?? '');
          this.title.setTitle(`${formData.title} - ${foundStep.label}`);
        }
      }
    } else {
      /** re-routing and reset the form to {formUrl}/{first-step} if route is just the {formUrl} */
      this.navigateToActiveStep(firstStepAlias, true);
      this.title.setTitle(`${formData.title} - ${firstStepLabel}`);
    }
  }

  /**
   * Navigate to the active step
   * @param formUrl selected form url
   * @param step Step alias to navigate
   * @param replaceUrl replace the current url or not
   */
  private navigateToActiveStep(step: string, replaceUrl = false) {
    this.router.navigate([`/${this.selectedFormUrl}/${step}`], { replaceUrl });
  }

  /**
   * Updates the form values for a specific step.
   *
   * @param guid - The unique identifier of the form.
   * @param stepId - The unique identifier of the step.
   * @param data - The data to be updated for the step.
   * @returns An Observable that emits an object containing the message and the next step.
   */
  private updateFormValues(
    guid: string,
    stepId: string,
    data: components['schemas']['SaveFormStepCommand'],
  ): Observable<{ message: string; nextStep: string }> {
    return this.http.patch<{ message: string; nextStep: string }>(
      `${this.baseUrl}v1/form/${guid}/steps/${stepId}`,
      data,
    );
  }

  /**
   * Saves the form data for a specific step.
   * @param stepData - The data of the active step.
   * @returns A Promise that resolves to the HTTP response from the server.
   */
  async updateForm(stepData: ActiveStepData) {
    if (stepData?.stepFormData) {
      const stepId = this.formdata().steps.find(({ alias }: { alias: string }) => alias === stepData.stepAlias)?.id;

      try {
        if (!this.selectedFormGuid() || !stepId || !stepData.stepFormData) {
          throw new Error('Form not found');
        }
        const { nextStep } = await lastValueFrom(
          this.updateFormValues(this.selectedFormGuid() ?? '', stepId, {
            fields: this.mapFieldValues(stepData.stepFormData),
          }),
        );
        const nextStepAlias = this.formdata().steps.find(({ id }: { id: string }) => id === nextStep)?.alias ?? '';
        this.navigateToActiveStep(nextStepAlias);
      } catch (e) {
        const errorMessage = handleError(e as HttpErrorResponse, this.router);
        this.error.set(errorMessage);
      }
    } else {
      this.navigateToActiveStep(stepData.stepAlias);
    }
  }

  /**
   * Maps the field values to an array of objects with id and value properties, requested as the reqBody in patch form values.
   * @param fields - The fields object containing the field names and values.
   * @returns An array of objects with id and value properties.
   */
  private mapFieldValues(fields: Record<string, unknown>) {
    return Object.entries(fields).map(([name, value]) => ({
      id: name,
      value: typeof value === 'string' ? value : '',
    }));
  }

  /** Exposing signals from the service */
  formdata = toSignal<IForm, IForm>(this.formData$, {
    initialValue: { title: '', steps: [] },
  });
  activeStep = toSignal<string, string>(this.activeStep$, { initialValue: '' });
}
