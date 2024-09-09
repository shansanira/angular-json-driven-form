import { NgClass } from '@angular/common';
import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { FormFieldComponent } from '../../form-field/form-field.component';
import { TextField } from '../../models/form.model';

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './text-area.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextAreaComponent),
    },
  ],
})
export class TextAreaComponent extends ControlValueAccessorDirective<string, TextField> {
  formField = input.required<TextField>();
}
