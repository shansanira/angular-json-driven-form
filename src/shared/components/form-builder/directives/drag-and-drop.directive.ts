import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  model,
} from '@angular/core';

@Directive({
  selector: '[appDrag]',
  standalone: true,
})
export class DragDirective implements AfterViewInit {
  files = model<File[]>([]);
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  bgColor = '';

  @HostBinding('style.background') private background = '';

  ngAfterViewInit(): void {
    setTimeout(() => {
      const bg = window.getComputedStyle(this.el.nativeElement).backgroundColor;
      if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
        this.bgColor = 'rgb(255, 255, 255)';
      } else {
        this.bgColor = bg;
      }
    }, 1000);
  }

  private darkenColor(color: string, percent: number): string {
    const rgb = color.match(/\d+/g);

    if (!rgb) {
      return color;
    }

    const r = Math.max(0, parseInt(rgb[0]) * (1 - percent / 100));
    const g = Math.max(0, parseInt(rgb[1] ?? '') * (1 - percent / 100));
    const b = Math.max(0, parseInt(rgb[2] ?? '') * (1 - percent / 100));

    return `rgb(${r}, ${g}, ${b})`;
  }

  @HostListener('dragover', ['$event']) public onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = this.darkenColor(this.bgColor, 10);
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '';
  }

  @HostListener('drop', ['$event']) public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '';

    const files: File[] = [];

    if (event.dataTransfer) {
      for (const file of Array.from(event.dataTransfer.files)) {
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      this.files.set(files);
    }
  }
}
