import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { FormFieldTypes } from '../models/form.model';
import { ValidationErrorsComponent } from '../validation/validation-errors/validation-errors.component';

@Component({
  selector: 'app-group-form-field',
  standalone: true,
  imports: [NgClass, ValidationErrorsComponent],
  templateUrl: './group-form-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupFormFieldComponent {
  formField = input.required<FormFieldTypes>();
  errors = input<Record<string, ValidationErrors> | null>({});
  showError = input<boolean | undefined>();
  isHorizontal = input.required<boolean>();
}
