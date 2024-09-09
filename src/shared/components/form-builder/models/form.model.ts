export enum FieldType {
  TextField = 'TextField',
  DateField = 'DateField',
  UploadField = 'UploadField',
  SelectionField = 'SelectionField',
  InterField = 'InterField',
}

export interface FileFieldValue {
  name: string;
  size: number;
  reference: string;
}

export type ValueTypes = string | number | boolean | Date | string[] | undefined | FileFieldValue | null;

export interface IForm {
  title: string;
  steps: Step[];
}

export interface Step {
  id: string;
  alias: string;
  label: string;
  blocks: Block[];
  isComplete: boolean;
  type: string;
}

export interface Block {
  fields: (TextField | UploadField | SelectionField)[];
  alias: string;
  label: string;
  id: string;
  type: string;
}

export interface FieldDefinition<T extends FieldType, K extends ValueTypes> {
  id: string;
  name: string;
  label: string;
  value: K;
  fieldType: T;
  htmlInputType: string;
  validators: IValidators;
  extras?: Extras;
  disabled?: boolean;
  readonly?: boolean;
  hideLabel?: boolean;
  defaultValue?: K;
  showInForm?: boolean;
  showInOutput?: boolean;
  showInOverview?: boolean;
  explanation?: string;
  labelAfter?: string;
  precondition?: Precondition[];
  postcondition?: Postcondition[];
  placeholder?: string;
  volatile?: boolean;
}

export interface TextField extends FieldDefinition<FieldType.TextField, string> {
  textFieldType: string;
  lines?: number;
  pattern?: RegExp;
  length?: number;
}

export interface UploadField extends FieldDefinition<FieldType.UploadField, FileFieldValue | null> {
  fileTypes?: string;
  maximumCount?: number;
  minimumCount?: number;
  maximumSize?: number;
}

export interface SelectionField extends FieldDefinition<FieldType.SelectionField, string> {
  options?: Option[];
}

export interface IValidators {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
}

interface Extras {
  min: string;
  max: string;
  step: string;
  icon: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface Value {
  technicalValue: string;
  displayValue: string;
  alias: unknown;
}

export interface Precondition {
  formula: string;
  result: Result;
}

export interface Postcondition {
  condition: {
    formula: string;
    result: Result;
  };
  message: string;
  validationMode: 'mustConform';
}

type Result = 'none' | 'false' | 'true';
