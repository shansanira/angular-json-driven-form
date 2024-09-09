/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidatorFn, Validators } from '@angular/forms';

import { components } from '../../../../generated/iprox-forms.interface';
import { IValidators, SelectionField, TextField, UploadField, Value } from '../models/form.model';

/**
 * Checks if the given block is a FieldsBlock.
 *
 * @param block - The block to check.
 * @returns The FieldsBlock if the block is a FieldsBlock, otherwise null.
 */
export function isFieldsBlock(
  block:
    | components['schemas']['AuthenticationBlock']
    | components['schemas']['AuthenticationBlockBase']
    | components['schemas']['EHerkenningBlock']
    | components['schemas']['EidasBlock']
    | components['schemas']['FieldsBlock']
    | components['schemas']['IdentificationBlock']
    | components['schemas']['OverviewBlock']
    | components['schemas']['SigningBlock']
    | null,
): components['schemas']['FieldsBlock'] | null {
  if (block && Object.prototype.hasOwnProperty.call(block, 'fields')) {
    return block as components['schemas']['FieldsBlock'];
  }
  return null;
}

/**
 * Maps validators based on the provided field.
 * @param field - The field object to map validators from.
 * @returns The mapped validators object.
 */
export function mapValidators(field: components['schemas']['Field']): IValidators {
  const mappedValidators: IValidators = {};

  if (field.required === 'mustHave' || field.required === 'shouldHave') {
    mappedValidators.required = true;
  }
  return mappedValidators;
}

/**
 * Checks if a specific step is completed based on the event log.
 * @param eventLog - The event log containing information about completed steps.
 * @param stepId - The ID of the step to check.
 * @returns A boolean indicating whether the step is completed or not.
 */
export function mapStepCompleted(eventLog: components['schemas']['FormEvent'][], stepId: string): boolean {
  return eventLog.some(({ elementId }) => elementId === stepId);
}

/**
 * Maps the value of an array of `Value` objects to a string.
 *
 * @param value - An array of `Value` objects or `undefined`.
 * @returns The display value of the first element in the `value` array, or an empty string if `value` is `undefined`.
 */
export function mapValue(value: Value[] | undefined): string {
  return value?.[0]?.displayValue ?? '';
}

/**
 * Maps the file field value to a structured object.
 *
 * @param value - The value to be mapped.
 * @returns The mapped file field value object.
 */
export function mapFileFieldValue(value: Value[] | undefined) {
  const fileFieldValue = {
    name: value?.[0]?.displayValue ?? '',
    size: 0,
    reference: '',
  };
  return fileFieldValue;
}

/**
 * Removes HTML tags from the given text.
 *
 * @param text - The text containing HTML tags.
 * @returns The text without HTML tags.
 */
export function removeHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Maps an HTML input type based on the provided type.
 * @param type - The input type to be mapped.
 * @returns The mapped HTML input type.
 */
export function mapHtmlInputType(type: string): string {
  switch (type) {
    case 'text':
      return 'text';
    case 'email':
      return 'email';
    case 'bsn':
      return 'text';
    case 'zip':
      return 'text';
    case 'euro':
      return 'text';
    case 'iban':
      return 'text';
    case 'euroWithCents':
      return 'text';
    case 'UploadField':
      return 'file';
    default:
      return 'text';
  }
}

/**
 * Maps the length based on the type.
 * @param type - The type of the value.
 * @param length - The length of the value.
 * @returns The mapped length.
 */
export function mapLength(type: string, length: number | string | undefined): number | undefined {
  switch (type) {
    case 'bsn':
      return 9;
    case 'zip':
      return 6;
    default:
      return typeof length === 'string' ? parseInt(length, 10) : length;
  }
}

/**
 * Maps a pattern based on the given type.
 *
 * @param type - The type of pattern to map.
 * @returns The regular expression pattern for the given type, or undefined if the type is not recognized.
 */
export function mapPattern(type: string): RegExp | undefined {
  switch (type) {
    case 'bsn':
      return /^\d{9}$/;
    case 'zip':
      return /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-zA-Z]{2}$/;
    case 'iban':
      return /^([A-Z]{2}\d{2})([A-Z0-9]{1,30})$/;
    case 'euroWithCents':
      return /^\d{1,3}(,\d{3})*(\.\d{0,2})?$/;
    case 'euro':
      return /^\d{1,3}(,\d{3})*(\.\d{0,2})?$/;
    default:
      return undefined;
  }
}

/**
 * Safely parses a JSON string and returns the parsed value.
 * If parsing fails, the original value is returned.
 *
 * @param value - The JSON string to parse.
 * @returns The parsed JSON value or the original value if parsing fails.
 */
export function safeParseJson(value: string): string {
  try {
    return JSON.parse(value);
  } catch (_) {
    return value;
  }
}

export function formatAlias(alias: string): string {
  return alias.replace(/ /g, '-');
}

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
