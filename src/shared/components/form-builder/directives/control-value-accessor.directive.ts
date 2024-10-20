import { Directive, Injector, InputSignal, OnInit, inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
} from '@angular/forms';
import { Subject, distinctUntilChanged, startWith, takeUntil, tap } from 'rxjs';

import { FormFieldTypes } from '../models/form.model';

@Directive({
  selector: '[appControlValueAccessor]',
  standalone: true,
})
export abstract class ControlValueAccessorDirective<T, F extends FormFieldTypes>
  implements ControlValueAccessor, OnInit
{
  control!: FormControl;
  errorMessage = '';
  destroy$ = new Subject<void>();

  private injector = inject(Injector);
  private _isDisabled = false;
  private _onTouched: () => void = () => null;

  abstract get formField(): InputSignal<F>;

  ngOnInit(): void {
    this.setFormControl();
  }

  setFormControl() {
    try {
      const formControl = this.injector.get(NgControl);

      switch (formControl.constructor) {
        case FormControlName:
          this.control = this.injector.get(FormGroupDirective).getControl(formControl as FormControlName);
          break;
        default:
          this.control = (formControl as FormControlDirective).form as FormControl;
          break;
      }
    } catch (error) {
      this.control = new FormControl();
      console.error('Control is not defined', error);
    }
  }

  writeValue(value: T): void {
    if (value === this.control?.value) {
      return;
    }
    if (this.control) {
      this.control.setValue(value);
    } else {
      throw new Error('Control is not defined');
    }
  }

  registerOnChange(onChange: (value: T) => void): void {
    this.control?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.control.value),
        distinctUntilChanged(),
        tap((value) => onChange(value)),
      )
      .subscribe(() => this.control?.markAsUntouched());
  }

  registerOnTouched(onTouched: () => void): void {
    this._onTouched = onTouched;
  }

  setDisabledState?(disabled: boolean): void {
    this._isDisabled = disabled;
  }

  /**
   * get tailwind class based on the conditions to show error state or normal state of the filed
   * @param customCondition any custom condition that needs to be checked for error class
   * @param isBorder is the field border required
   * @returns tailwind classes based on the conditions
   */
  getErrorClass(customCondition = true, isBorder = true): string {
    return this.control.invalid && this.control.touched && this.control.dirty && customCondition
      ? 'border-error'
      : isBorder
        ? 'border-field'
        : 'border-transparent';
  }

  /**
   * map the explanation and error message to the form field with id
   * @returns aria-describedby attribute value
   */
  getAriaDescribedBy(): string {
    const ids = [];
    if (this.formField().explanation) {
      ids.push(`${this.formField().id}-help`);
    }
    if (this.control.invalid && this.control.touched && this.control.dirty) {
      ids.push(`${this.formField().id}-error`);
    }
    return ids.join(' ');
  }
}
