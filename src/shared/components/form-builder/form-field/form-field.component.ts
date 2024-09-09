import { NgClass } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, ViewChild, inject, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroEnvelope } from '@ng-icons/heroicons/outline';

import { SelectionField, TextField, UploadField } from '../models/form.model';
import { ValidationErrorsComponent } from '../validation/validation-errors/validation-errors.component';

// update the type & provideIcons() to include the new icon
export type AcceptedIcons = 'heroEnvelope';
type Sides = 'left' | 'right';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [NgClass, ValidationErrorsComponent, NgIconComponent],
  templateUrl: './form-field.component.html',
  providers: [provideIcons({ heroEnvelope })],
})
export class FormFieldComponent implements AfterViewChecked {
  private cdr = inject(ChangeDetectorRef);

  formField = input.required<TextField | UploadField | SelectionField>();
  labelBefore = input<string | undefined>();
  errors = input<Record<string, ValidationErrors> | null>({});
  showError = input<boolean | undefined>();
  icon = input<AcceptedIcons | undefined>();
  iconSide = input<Sides>('left');
  inputField = input<ElementRef<HTMLInputElement>>();

  @ViewChild('dynamicLabelRight', { static: false }) dynamicLabelRight!: ElementRef<HTMLLabelElement>;
  @ViewChild('dynamicLabelLeft', { static: false }) dynamicLabelLeft!: ElementRef<HTMLLabelElement>;

  ngAfterViewChecked(): void {
    if (this.inputField()) {
      if (this.formField().labelAfter && this.dynamicLabelRight) {
        const labelWidth = this.dynamicLabelRight.nativeElement.offsetWidth;
        this.adjustInputPadding(this.inputField(), labelWidth, 'right');
      }

      if (this.labelBefore() && this.dynamicLabelLeft) {
        const labelWidth = this.dynamicLabelLeft.nativeElement.offsetWidth;
        this.adjustInputPadding(this.inputField(), labelWidth);
      }

      if (this.icon()) {
        const iconWidth = 22;
        this.adjustInputPadding(this.inputField(), iconWidth, this.iconSide());
      }
      this.cdr.detectChanges();
    }
  }

  private adjustInputPadding(
    element: ElementRef<HTMLInputElement> | undefined,
    width: number,
    side: Sides = 'left',
  ): void {
    if (element) {
      if (side === 'left') {
        element.nativeElement.style.paddingLeft = `${width + 15}px`;
      } else {
        element.nativeElement.style.paddingRight = `${width + 15}px`;
      }
    }
  }

  focusInput(): void {
    if (this.inputField() && this.inputField()?.nativeElement) {
      this.inputField()?.nativeElement.focus();
    }
  }
}
