import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'ipx-validation-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationErrorsComponent {
  errors = input<Record<string, ValidationErrors> | null>({});
  controlLabel = input.required<string>();
  id = input.required<string>();

  errorMessages: Record<string, (controlLabel: string, errorDetails: Record<string, string>) => string> = {
    required: (controlLabel) => `${controlLabel} is required.`,
    minlength: (controlLabel, errorDetails) =>
      `${controlLabel} must be at least ${errorDetails['requiredLength']} characters long.`,
    maxlength: (controlLabel, errorDetails) =>
      `${controlLabel} must be at most ${errorDetails['requiredLength']} characters long.`,
    email: () => 'Enter a valid email address.',
    pattern: () => 'Invalid format.',
    min: (controlLabel, errorDetails) => `${controlLabel} must be at least ${errorDetails['min']}.`,
    max: (controlLabel, errorDetails) => `${controlLabel} must be at most ${errorDetails[`max`]}.`,
    requiredTrue: (controlLabel) => `${controlLabel} must be true.`,
  };

  getErrorMessage(errorKey: string, errorValue: Record<string, string>): string | null {
    const getMessage = this.errorMessages[errorKey] || (() => 'Invalid field.');
    return getMessage(this.controlLabel(), errorValue);
  }
}
