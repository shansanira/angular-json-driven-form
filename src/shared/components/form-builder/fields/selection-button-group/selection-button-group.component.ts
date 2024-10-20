import { NgClass } from '@angular/common';
import { Component, OnInit, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { GroupFormFieldComponent } from '../../group-form-field/group-form-field.component';
import { SelectionField } from '../../models/form.model';
import { updateFormControl } from '../../utils/helper-functions.utils';

@Component({
  selector: 'app-selection-button-group',
  standalone: true,
  imports: [NgClass, GroupFormFieldComponent],
  templateUrl: './selection-button-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectionButtonGroupComponent),
      multi: true,
    },
  ],
})
export class SelectionButtonGroupComponent
  extends ControlValueAccessorDirective<string | string[], SelectionField>
  implements OnInit
{
  formField = input.required<SelectionField>();

  private selectedValues: string | string[] = '';

  override ngOnInit(): void {
    // Since OnInit is a override, have to call the setFormControl() function here.
    this.setFormControl();
    if (this.control.value) {
      this.selectedValues = this.formField().multiple
        ? ((this.control.value as string[]) ?? [])
        : ((this.control.value as string) ?? '');
    }
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

  isSelected(optionId: string): boolean {
    return this.selectedValues.includes(optionId);
  }

  toggleSelection(optionId: string) {
    if (this.formField().multiple && Array.isArray(this.selectedValues)) {
      this.selectedValues = this.setSelectedValues(this.selectedValues, optionId);
      this.writeValue([...this.selectedValues]);
    } else {
      if (!this.isSelected(optionId)) {
        this.selectedValues = optionId;
      } else {
        this.selectedValues = '';
      }
      this.writeValue(this.selectedValues);
    }

    updateFormControl(this.control);
  }
}
