import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnChanges, inject, input, model } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { FileUploaderComponent } from './fields/file-uploader/file-uploader.component';
import { TextAreaComponent } from './fields/text-area/text-area.component';
import { TextFieldComponent } from './fields/text-field/text-field.component';
import { FieldWithFiles } from './models/file-upload.model';
import { IForm, SelectionField, TextField, UploadField } from './models/form.model';
import { getValidationErrors } from './utils/helper-functions.utils';

export interface ActiveStepData {
  stepAlias: string;
  stepFormData?: Record<string, unknown>;
}

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [ReactiveFormsModule, TextFieldComponent, TextAreaComponent, FileUploaderComponent, JsonPipe],
  templateUrl: './form-builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormBuilderComponent implements OnChanges {
  formData = input.required<IForm>();
  activeStep = model.required<ActiveStepData>();
  oldStepValues: Record<string, unknown> = {};
  files = model<FieldWithFiles>({ fieldId: '', files: [] });

  fb = inject(NonNullableFormBuilder);

  form = this.fb.group({});
  currentStepIndex = 0;

  ngOnChanges(): void {
    this.createForm();
    this.currentStepIndex = this.formData().steps.findIndex(({ alias }) => alias === this.activeStep().stepAlias);
    console.log(this.currentStepIndex);
  }

  createForm(): void {
    const allFields: (TextField | UploadField | SelectionField)[] = this.formData().steps.flatMap((step) =>
      step.blocks.flatMap((block) => block.fields),
    );

    allFields.forEach((field) => {
      const validators = getValidationErrors(field);

      this.form.addControl(
        field?.name,
        this.fb.control(field.fieldType === 'UploadField' ? null : field?.value, { validators }),
      );
    });
  }

  isCurrentStepValid(): boolean {
    const currentStep = this.formData().steps[this.currentStepIndex];
    let isValid = true;

    currentStep?.blocks.forEach((block) => {
      block.fields.forEach((field) => {
        const control = this.form.get(field.name);
        if (control && control.invalid) {
          isValid = false;
          control.markAsTouched();
        }
      });
    });

    return isValid;
  }

  getCurrentStepFields() {
    const currentStepFields =
      this.formData().steps[this.currentStepIndex]?.blocks.flatMap((block) => block.fields) ?? [];

    const currentStepFormValues: Record<string, unknown> = {};
    currentStepFields.forEach((field) => {
      if (this.form.get(field.name)) {
        currentStepFormValues[field.name] = this.form.get(field.name)?.value;
      }
    });

    return currentStepFormValues;
  }

  nextStep(): void {
    let step = this.currentStepIndex;
    let stepFormData: Record<string, unknown> | undefined;
    step = ++this.currentStepIndex;

    if (this.isCurrentStepValid()) {
      this.activeStep.update((value) => ({
        stepAlias: this.formData().steps[step]?.alias ?? value.stepAlias,
        stepFormData,
      }));
    }
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.activeStep.update((value) => ({
        stepAlias: this.formData().steps[--this.currentStepIndex]?.alias ?? value.stepAlias,
        stepFormData: undefined,
      }));
      this.oldStepValues = this.getCurrentStepFields();
    }
  }

  onSubmit(): void {
    console.info('form values: ', this.form);
  }

  onFileDrop(event: FieldWithFiles): void {
    this.files.set(event);
  }
}
