import { components } from '../../../../generated/iprox-forms.interface';
import {
  Block,
  FieldType,
  IForm,
  Option,
  Postcondition,
  Precondition,
  SelectionField,
  Step,
  TextField,
  UploadField,
  Value,
} from '../models/form.model';
import {
  formatAlias,
  isFieldsBlock,
  mapFileFieldValue,
  mapHtmlInputType,
  mapLength,
  mapPattern,
  mapStepCompleted,
  mapValidators,
  mapValue,
  removeHtmlTags,
  safeParseJson,
} from './helper-functions.utils';

/**
 * Maps the form steps from the provided form data.
 *
 * @param formData - The form data to map.
 * @returns The mapped form steps.
 */
export function mapFormSteps(formData: components['schemas']['FormResultDetailDto']): IForm {
  let formSteps: Step[] = [];
  if (formData && formData?.form?.steps) {
    formSteps = formData?.form?.steps?.map((step) => ({
      id: step.uniqueId ?? '',
      alias: formatAlias(step.alias ?? ''),
      label: step.label ?? '',
      type: (step as { $type?: string })['$type'] ?? 'InternalStep',
      isComplete: mapStepCompleted(formData?.form?.eventLog ?? [], step.uniqueId ?? ''),
      blocks: step.blocks?.map(mapBlock) ?? [],
    }));
  }

  return { title: formData?.form?.label ?? '', steps: formSteps };
}

/**
 * Maps a block to a Block object.
 *
 * @param block - The block to be mapped.
 * @returns The mapped Block object.
 */
function mapBlock(
  block:
    | components['schemas']['AuthenticationBlock']
    | components['schemas']['AuthenticationBlockBase']
    | components['schemas']['EHerkenningBlock']
    | components['schemas']['EidasBlock']
    | components['schemas']['FieldsBlock']
    | components['schemas']['IdentificationBlock']
    | components['schemas']['OverviewBlock']
    | components['schemas']['SigningBlock'],
): Block {
  return {
    alias: formatAlias(block.alias ?? ''),
    label: block.label ?? '',
    id: block.uniqueId ?? '',
    type: (block as { $type?: string })['$type'] ?? 'FieldsBlock',
    fields: isFieldsBlock(block)?.fields?.map(mapField) ?? [],
  };
}

/**
 * Maps a field to its corresponding type of TextField, UploadField, or SelectionField.
 *
 * @param field - The field to be mapped.
 * @returns The mapped field as a TextField, UploadField, or SelectionField.
 */
function mapField(
  field:
    | components['schemas']['Cluster']
    | components['schemas']['DateField']
    | components['schemas']['InterField']
    | components['schemas']['KvkBusinessAddressSelect']
    | components['schemas']['KvkBusinessLocationSelect']
    | components['schemas']['LookupField']
    | components['schemas']['SelectionField']
    | components['schemas']['TextField']
    | components['schemas']['UploadField'],
): TextField | UploadField | SelectionField {
  switch ((field as { $type?: string }).$type as FieldType) {
    case FieldType.TextField:
      return mapTextField(field);

    case FieldType.UploadField:
      return mapUploadField(field);

    case FieldType.SelectionField:
      return mapSelectionField(field);

    default:
      return mapBaseField(field) as TextField;
  }
}

/**
 * Maps a base field to a simplified object representation.
 *
 * @param field - The base field to be mapped.
 * @returns The mapped object with the following properties:
 *   - id: The unique identifier of the field.
 *   - name: The name of the field.
 *   - label: The label of the field.
 *   - labelAfter: The label to be displayed after the field.
 *   - htmlInputType: The HTML input type of the field.
 *   - validators: The validators applied to the field.
 *   - readonly: Indicates if the field is read-only.
 *   - hideLabel: Indicates if the field label should be hidden.
 *   - defaultValue: The default value of the field.
 *   - explanation: The explanation text of the field.
 *   - precondition: The precondition(s) of the field.
 *   - postcondition: The postcondition(s) of the field.
 *   - placeholder: The placeholder text of the field.
 */
function mapBaseField(
  field:
    | components['schemas']['Cluster']
    | components['schemas']['DateField']
    | components['schemas']['InterField']
    | components['schemas']['KvkBusinessAddressSelect']
    | components['schemas']['KvkBusinessLocationSelect']
    | components['schemas']['LookupField']
    | components['schemas']['SelectionField']
    | components['schemas']['TextField']
    | components['schemas']['UploadField'],
) {
  return {
    id: field.uniqueId ?? '',
    name: field.uniqueId ?? '',
    label: field.label ?? '',
    labelAfter: (field as { labelAfter?: string }).labelAfter ?? '',
    htmlInputType: mapHtmlInputType(
      (field as { textInputType?: string }).textInputType ?? (field as { $type?: string }).$type ?? 'text',
    ),
    validators: mapValidators(field),
    readonly: field.readOnly ?? false,
    hideLabel: field.hideLabel ?? false,
    defaultValue: safeParseJson(field.defaultValue ?? ''),
    explanation: removeHtmlTags(field.explanation ?? ''),
    precondition: (field as { precondition?: Precondition[] }).precondition ?? undefined,
    postcondition: (field as { postcondition?: Postcondition[] }).postcondition ?? undefined,
    placeholder: (field as { placeholder?: string }).placeholder ?? undefined,
  };
}

/**
 * Maps a TextField object to a TextField type.
 *
 * @param field - The TextField object to be mapped.
 * @returns The mapped TextField object.
 */
function mapTextField(field: components['schemas']['TextField']): TextField {
  const baseField = mapBaseField(field);

  return {
    ...baseField,
    fieldType: FieldType.TextField,
    textFieldType: field.textInputType ?? 'text',
    lines: field.lines ?? 1,
    length: mapLength(field.textInputType ?? 'Text', field.length),
    pattern: mapPattern(field.textInputType ?? 'Text'),
    value: (field as { values?: Value[] }).values?.length
      ? mapValue((field as { values?: Value[] }).values)
      : safeParseJson(field.defaultValue ?? ''),
  };
}

/**
 * Maps an upload field object to an UploadField type.
 *
 * @param field - The upload field to be mapped.
 * @returns The mapped UploadField object.
 */
function mapUploadField(field: components['schemas']['UploadField']): UploadField {
  const baseField = mapBaseField(field);

  return {
    ...baseField,
    fieldType: FieldType.UploadField,
    fileTypes: field.fileTypes ?? '',
    maximumCount: field.maximumCount,
    minimumCount: field.minimumCount,
    maximumSize: field.maximumSize,
    value: (field as { values?: Value[] }).values?.length
      ? mapFileFieldValue((field as { values?: Value[] }).values)
      : null,
    defaultValue: mapFileFieldValue((field as { values?: Value[] }).values),
  };
}

/**
 * Maps a selection field object from the API response to a SelectionField type.
 *
 * @param field - The selection field to be mapped.
 * @returns The mapped SelectionField object.
 */
function mapSelectionField(field: components['schemas']['SelectionField']): SelectionField {
  const baseField = mapBaseField(field);

  return {
    ...baseField,
    fieldType: FieldType.SelectionField,
    options: (field as { options?: Option[] }).options ?? [],
    value: (field as { values?: Value[] }).values?.length
      ? mapValue((field as { values?: Value[] }).values)
      : safeParseJson(field.defaultValue ?? ''),
  };
}
