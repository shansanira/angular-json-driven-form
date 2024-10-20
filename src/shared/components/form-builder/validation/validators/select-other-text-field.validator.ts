import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function otherFieldValidator(message: string, control: FormControl): ValidatorFn {
  return (): ValidationErrors | null => {
    if (control.dirty && control.touched && control.invalid && control.value) {
      return { other: { message } };
    }
    return null;
  };
}
