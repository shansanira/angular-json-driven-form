import { NgClass } from '@angular/common';
import { Component, forwardRef, input, model, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroDocumentPlusSolid } from '@ng-icons/heroicons/solid';
import { filesize } from 'filesize';

import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { DragDirective } from '../../directives/drag-and-drop.directive';
import { FormFieldComponent } from '../../form-field/form-field.component';
import { FieldWithFiles } from '../../models/file-upload.model';
import { FileFieldValue, UploadField } from '../../models/form.model';
import { UploadListComponent } from './upload-list/upload-list.component';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, DragDirective, NgClass, NgIconComponent, UploadListComponent],
  templateUrl: './file-uploader.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FileUploaderComponent),
    },
    provideIcons({ heroDocumentPlusSolid }),
  ],
})
export class FileUploaderComponent extends ControlValueAccessorDirective<FileFieldValue, UploadField> {
  formField = input.required<UploadField>();
  files = model<FieldWithFiles>({ fieldId: '', files: [] });
  progressValue = signal<number>(0);

  startDummyProgress() {
    this.progressValue.set(0);
    const interval = setInterval(() => {
      if (this.progressValue() < 100) {
        console.info('progressValue', this.progressValue());
        this.progressValue.set(this.progressValue() + 10);
      } else {
        clearInterval(interval);
      }
    }, 300);
  }

  getFormattedFileSize(size: number): string {
    return filesize(size);
  }

  filesDropped(event: File[]): void {
    this.files.set({ fieldId: this.formField().id, files: [...this.files().files, ...event] });
  }

  onFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && this.control.value?.file !== fileList[0]) {
      console.info('FileUpload -> files', fileList);
      this.filesDropped(Array.from(fileList));
    }
  }
}
