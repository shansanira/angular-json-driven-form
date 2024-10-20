import { NgClass } from '@angular/common';
import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { FormFieldComponent } from '../../form-field/form-field.component';
import { SelectionField } from '../../models/form.model';

@Component({
  selector: 'app-select-dropdown',
  standalone: true,
  imports: [FormFieldComponent, NgClass, ReactiveFormsModule],
  templateUrl: './select-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDropdownComponent),
      multi: true,
    },
  ],
})
export class SelectDropdownComponent extends ControlValueAccessorDirective<string | string[], SelectionField> {
  formField = input.required<SelectionField>();
  isList = input.required<boolean>();

  getInputSize() {
    if (this.isList()) {
      let optionsLength = this.formField().options.length;
      if (!this.formField().validators.required) {
        optionsLength += 1;
      }
      return optionsLength >= 5 ? 5 : optionsLength;
    }

    return 1;
  }
}
