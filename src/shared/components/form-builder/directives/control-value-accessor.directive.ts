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

import { SelectionField, TextField, UploadField } from '../models/form.model';

@Directive({
  selector: '[ipxControlValueAccessor]',
  standalone: true,
})
export abstract class ControlValueAccessorDirective<T, F extends TextField | UploadField | SelectionField>
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
    } catch (_error) {
      this.control = new FormControl();
    }
  }

  writeValue(value: T): void {
    this.control ? this.control.setValue(value) : (this.control = new FormControl(value));
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

  getErrorClass(): string {
    return this.control.invalid && this.control.touched && this.control.dirty ? 'border-error' : 'border-field';
  }

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
