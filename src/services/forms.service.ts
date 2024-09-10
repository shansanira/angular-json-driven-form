import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';

import { IForm } from '../shared/components/form-builder/models/form.model';
import { handleError } from '../utils/error-handler';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  private http = inject(HttpClient);
  private title = inject(Title);

  activeStep = signal<string>('');
  error = signal<string | undefined>(undefined);
  selectedFormId = signal<number | undefined>(undefined);

  setFormId(id: number | undefined): void {
    this.selectedFormId.set(id);
  }

  /**
   * Fetch the form data using the fetched form guid from the API
   */
  formData$: Observable<IForm> = toObservable(this.selectedFormId).pipe(
    switchMap(() => this.http.get(`assets/form.json`)),
    map((response) => {
      console.info(response);
      return response as IForm;
    }),
    tap((formData) => this.setInitialStep(formData)),
    catchError((e) => {
      this.title.setTitle('Error!');
      const errorMessage = handleError(e);
      this.error.set(errorMessage);
      return throwError(() => errorMessage);
    }),
  );

  setInitialStep(formData: IForm): void {
    this.activeStep.set(formData.steps[0].alias);
  }

  /** Exposing signals from the service */
  formdata = toSignal<IForm, IForm>(this.formData$, {
    initialValue: { title: '', steps: [] },
  });
}
