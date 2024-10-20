import { NgClass } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, forwardRef, input } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { GroupFormFieldComponent } from '../../group-form-field/group-form-field.component';
import { SelectionField } from '../../models/form.model';
import { updateFormControl, validateCustomChoice } from '../../utils/helper-functions.utils';
import { ValidationErrorsComponent } from '../../validation/validation-errors/validation-errors.component';

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, ValidationErrorsComponent, GroupFormFieldComponent, FormsModule],
  templateUrl: './radio-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
})
export class RadioGroupComponent extends ControlValueAccessorDirective<string, SelectionField> implements OnInit {
  formField = input.required<SelectionField>();
  isHorizontal = input<boolean | undefined>();

  @ViewChild('customOptionControl') customOptionControl!: FormControl;
  @ViewChild('otherInputField') otherInputField!: ElementRef<HTMLInputElement>;

  selectedValue = '';
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
    this.selectedValue = this.control.value ?? '';
    this.otherOptionId =
      this.formField().options.find((option) => option.uniqueId === `${this.formField().id}-Other`)?.uniqueId ?? '';

    if (this.isSelected(this.otherOptionId)) {
      this.isOtherSelected = true;
      this.customChoice = this.selectedValue?.split(':').slice(1).join(':') ?? '';
    }
  }

  isSelected(optionId: string): boolean {
    return this.selectedValue?.split(':')[0] === optionId;
  }

  getOtherOptionLabel() {
    return this.formField().options.find(({ uniqueId }) => uniqueId === this.otherOptionId)?.label ?? '';
  }

  toggleSelection(optionId: string) {
    this.selectedValue = optionId;

    if (optionId === this.otherOptionId) {
      this.isOtherSelected = true;

      if (this.isOtherSelected) {
        setTimeout(() => {
          this.otherInputField?.nativeElement.focus();
        }, 10);
      }
    } else {
      this.isOtherSelected = false;
    }

    this.writeValue(optionId);
    updateFormControl(this.control);
  }

  updateValue() {
    let previousValue = '';

    if (this.isSelected(this.otherOptionId) && this.customChoice.trim()) {
      previousValue = this.selectedValue?.split(':').slice(1).join(':') ?? '';
      this.selectedValue = `${this.formField().id}-Other:${this.customChoice}`;
    }

    updateFormControl(this.control);
    validateCustomChoice(this.control, this.customChoiceErrorMessage, this.customOptionControl, this.isOtherSelected);

    if (this.customChoice.trim() && previousValue !== this.customChoice) {
      this.writeValue(`${this.otherOptionId}:${this.customChoice}`);
    }

    this.otherInputField?.nativeElement.blur();
  }

  inputValue() {
    updateFormControl(this.control);
    validateCustomChoice(this.control, this.customChoiceErrorMessage, this.customOptionControl, this.isOtherSelected);

    if (!this.customChoice.trim()) {
      this.selectedValue = `${this.formField().id}-Other:${this.customChoice}`;
      this.writeValue(`${this.otherOptionId}:${this.customChoice}`);
    }
  }

  getInputBorderClass() {
    return this.isOtherSelected && !this.customChoice ? 'border-error' : 'border-field';
  }
}
