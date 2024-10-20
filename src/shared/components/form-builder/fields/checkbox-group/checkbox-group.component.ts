import { NgClass } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, forwardRef, input } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { GroupFormFieldComponent } from '../../group-form-field/group-form-field.component';
import { SelectionField } from '../../models/form.model';
import { updateFormControl, validateCustomChoice } from '../../utils/helper-functions.utils';
import { ValidationErrorsComponent } from '../../validation/validation-errors/validation-errors.component';

@Component({
  selector: 'app-checkbox-group',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, ValidationErrorsComponent, GroupFormFieldComponent, FormsModule],
  templateUrl: './checkbox-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true,
    },
  ],
})
export class CheckboxGroupComponent extends ControlValueAccessorDirective<string[], SelectionField> implements OnInit {
  formField = input.required<SelectionField>();
  isHorizontal = input<boolean | undefined>();

  @ViewChild('customOptionControl') customOptionControl!: FormControl;
  @ViewChild('otherInputField') otherInputField!: ElementRef<HTMLInputElement>;

  private selectedValues: string[] = [];
  isOtherSelected = false;
  customChoice = '';
  otherOptionId = '';
  customChoiceErrorMessage = '';

  override ngOnInit(): void {
    // Since OnInit is a override, have to call the setFormControl() function here.
    this.setFormControl();
    this.setInitialValues();
  }

  private setInitialValues() {
    this.selectedValues = (this.formField().value as string[]) ?? [];
    this.otherOptionId =
      this.formField().options.find((option) => option.uniqueId === `${this.formField().id}-Other`)?.uniqueId ?? '';
    const otherOptionIndex = this.getOtherOptionIndex(this.selectedValues);

    if (otherOptionIndex !== -1) {
      this.isOtherSelected = true;
      this.customChoice = this.selectedValues[otherOptionIndex]?.split(':').slice(1).join(':') ?? '';
    }
  }

  private getOtherOptionIndex(selectedValues: string[]): number {
    return selectedValues.findIndex((val) => val.split(':')[0] === this.otherOptionId);
  }

  private setSelectedValues(existingValues: string[], newValue: string, passedIndex?: number): string[] {
    const index = passedIndex ?? existingValues.indexOf(newValue);
    if (index === -1) {
      existingValues.push(newValue);
    } else {
      existingValues.splice(index, 1);
    }

    return existingValues;
  }

  getOtherOptionLabel() {
    return this.formField().options.find(({ uniqueId }) => uniqueId === this.otherOptionId)?.label ?? '';
  }

  toggleSelection(optionId: string) {
    const otherOptionIndex = this.getOtherOptionIndex(this.selectedValues);
    if (optionId === this.otherOptionId) {
      this.isOtherSelected = !this.isOtherSelected;

      this.selectedValues = this.setSelectedValues(this.selectedValues, optionId, otherOptionIndex);

      if (this.isOtherSelected) {
        setTimeout(() => {
          this.otherInputField?.nativeElement.focus();
        }, 10);
      }
    } else {
      this.selectedValues = this.setSelectedValues(this.selectedValues, optionId);
    }

    this.writeValue([...this.selectedValues]);
    updateFormControl(this.control);

    if (this.formField().validators.required && this.selectedValues.length === 0) {
      this.control.setErrors({ required: true });
    }

    if (otherOptionIndex !== -1) {
      validateCustomChoice(this.control, this.customChoiceErrorMessage, this.customOptionControl, this.isOtherSelected);
    }
  }

  updateValue() {
    let previousValue = '';
    const otherOptionIndex = this.getOtherOptionIndex(this.selectedValues);

    if (otherOptionIndex !== -1 && this.customChoice.trim()) {
      previousValue = this.selectedValues[otherOptionIndex]?.split(':').slice(1).join(':') ?? '';
      this.selectedValues[otherOptionIndex] = `${this.formField().id}-Other:${this.customChoice}`;
    }

    updateFormControl(this.control);
    validateCustomChoice(this.control, this.customChoiceErrorMessage, this.customOptionControl, this.isOtherSelected);

    if (this.customChoice.trim() && previousValue !== this.customChoice) {
      this.writeValue([...this.selectedValues]);
    }

    this.otherInputField?.nativeElement.blur();
  }

  inputValue() {
    updateFormControl(this.control);
    validateCustomChoice(this.control, this.customChoiceErrorMessage, this.customOptionControl, this.isOtherSelected);

    if (!this.customChoice.trim()) {
      const otherOptionIndex = this.getOtherOptionIndex(this.selectedValues);
      this.selectedValues[otherOptionIndex] = `${this.formField().id}-Other:${this.customChoice}`;
      this.writeValue([...this.selectedValues]);
    }
  }

  isSelected(optionId: string): boolean {
    return this.selectedValues.includes(optionId) || (this.isOtherSelected && optionId.includes('Other'));
  }

  getInputBorderClass() {
    return this.isOtherSelected && !this.customChoice ? 'border-error' : 'border-field';
  }
}
