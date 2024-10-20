import { FormControl, ValidatorFn, Validators } from '@angular/forms';

import { SelectionField, TextField, UploadField } from '../models/form.model';
import { otherFieldValidator } from '../validation/validators/select-other-text-field.validator';

/**
 * Applies a number pattern to the given value based on the specified type.
 * @param value - The value to apply the number pattern to.
 * @param type - The type of number pattern to apply.
 * @param isNumbersOnly - Optional. Indicates whether to consider only numbers in the value. Default is false.
 * @returns The value with the applied number pattern.
 */
export function applyNumberPattern(value: string, type: string, isNumbersOnly = false): string {
  const cleanedValue = isNumbersOnly ? value.replace(/[^0-9.]/g, '') : value;

  const match = cleanedValue.match(/^\d+(\.\d{0,2})?$/);
  if (match) {
    switch (type) {
      case 'euroWithCents':
        return amountFormatter(match[0]);
      case 'euro':
        return amountFormatter(match[0]);
      case 'bsn':
        return match[0].substring(0, 9);
      case 'number':
        return amountFormatter(match[0]);
      default:
        return match[0];
    }
  }

  // If the value has more than two decimal places, truncate it
  const truncatedValue =
    type === 'euro' || type === 'euroWithCents'
      ? amountFormatter(cleanedValue.replace(/(\.\d{2})\d+/, '$1'))
      : cleanedValue;
  return truncatedValue;
}

/**
 * Formats the given value as an amount.
 *
 * @param value - The value to be formatted as an amount.
 * @returns The formatted amount as a string.
 */
export function amountFormatter(value: string): string {
  // Split the value into integer and decimal parts
  const parts = value.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
  let formattedIntegerPart = integerPart;

  if (integerPart) {
    // Add commas to the integer part
    formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Combine the formatted integer part with the decimal part
  return formattedIntegerPart + decimalPart;
}

/**
 * Retrieves an array of validation functions based on the provided field.
 *
 * @param field - The field to retrieve validation errors for.
 * @returns An array of ValidatorFn functions.
 */
export function getValidationErrors(field: TextField | UploadField | SelectionField): ValidatorFn[] {
  const validators: ValidatorFn[] = [];

  if (field?.validators.required) {
    validators.push(Validators.required);
  }
  if (field?.validators.minLength) {
    validators.push(Validators.minLength(field.validators.minLength));
  }
  if (field?.validators.maxLength) {
    validators.push(Validators.maxLength(field.validators.maxLength));
  }
  if (field?.validators.email || field?.htmlInputType === 'email') {
    validators.push(Validators.email);
  }
  if ('pattern' in field && field?.pattern) {
    validators.push(Validators.pattern(field.pattern));
  }

  return validators;
}

/**
 * updates the form control with dirty, touched and validity.
 * @param control - The form control to update.
 */
export function updateFormControl(control: FormControl) {
  control.markAsTouched();
  control.markAsDirty();
  control.updateValueAndValidity();
}

/**
 * sets the custom choice error message and validates the custom choice.
 * @param control main FormControl
 * @param message string
 * @param customOptionControl custom option FormControl
 * @param isOtherSelected boolean
 */
export function validateCustomChoice(
  control: FormControl,
  message: string,
  customOptionControl: FormControl,
  isOtherSelected: boolean,
) {
  if (isOtherSelected && !customOptionControl.value) {
    control.setValidators(otherFieldValidator(message, customOptionControl));
    control.setErrors({ other: { message } });
  } else {
    control.setErrors(null);
    control.clearValidators();
  }
}
