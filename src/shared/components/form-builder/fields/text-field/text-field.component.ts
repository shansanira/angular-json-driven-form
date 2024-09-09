import { NgClass } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Signal,
  ViewChild,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { AcceptedIcons, FormFieldComponent } from '../../form-field/form-field.component';
import { TextField } from '../../models/form.model';
import { applyNumberPattern } from '../../utils/helper-functions.utils';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, NgClass],
  templateUrl: './text-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextFieldComponent),
    },
  ],
})
export class TextFieldComponent extends ControlValueAccessorDirective<string, TextField> implements AfterViewChecked {
  private cdr = inject(ChangeDetectorRef);

  formField = input.required<TextField>();

  @ViewChild('inputField') inputFieldRef!: ElementRef<HTMLInputElement>;

  ngAfterViewChecked(): void {
    if (this.inputFieldRef) {
      this.cdr.detectChanges();
    }
  }

  labelBefore = computed(() => {
    let labelText;
    switch (this.formField().textFieldType) {
      case 'euroWithCents':
        labelText = 'EUR';
        break;
      case 'euro':
        labelText = 'EUR';
        break;
      default:
        return undefined;
    }
    return labelText;
  });

  icon: Signal<AcceptedIcons | undefined> = computed(() =>
    this.formField().htmlInputType === 'email' ? 'heroEnvelope' : undefined,
  );

  formatToPattern(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    const inputType = this.formField().textFieldType;
    const isNumberType =
      (inputType && inputType === 'bsn') ||
      inputType === 'number' ||
      inputType === 'naturalNumber' ||
      inputType === 'euro' ||
      inputType === 'euroWithCents';

    if (isNumberType) {
      const formattedValue = applyNumberPattern(value, inputType, true);

      if (inputElement.value !== formattedValue) {
        inputElement.value = formattedValue;
        this.control.setValue(formattedValue, { emitEvent: false, emitModelToViewChange: false });
      }
    }
  }
}
