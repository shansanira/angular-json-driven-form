import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChevronDown, heroChevronUp, heroXMark } from '@ng-icons/heroicons/outline';

import { ProgressBarComponent } from './../../../../progress-bar/progress-bar.component';

@Component({
  selector: 'app-upload-list',
  standalone: true,
  imports: [ProgressBarComponent, NgIconComponent],
  templateUrl: './upload-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ heroChevronDown, heroChevronUp, heroXMark })],
})
export class UploadListComponent {
  files = input.required<File[]>();
  isExpanded = signal<boolean>(false);

  toggleExpanded(): void {
    this.isExpanded.set(!this.isExpanded());
  }

  cancelUpload(file: File): void {
    console.info('cancel upload', file);
  }
}
