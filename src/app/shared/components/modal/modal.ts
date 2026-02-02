import { isPlatformBrowser } from '@angular/common';
import { Component, input, output, effect, HostListener, computed, PLATFORM_ID, inject } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  // Input signals
  isOpen = input<boolean>(false);
  title = input<string>('Modal Title');
  showCloseButton = input<boolean>(true);
  closeOnBackdropClick = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  // Computed size class
  protected readonly sizeClass = computed(() => {
    const sizeMap = {
      sm: 'w-[400px]',
      md: 'w-[600px]',
      lg: 'w-[900px]',
      xl: 'w-[1000px]',
    };
    return sizeMap[this.size()];
  });

  // Output signals
  readonly closed = output<void>();

  // Close modal handler
  protected close(): void {
    if (this.isOpen()) {
      this.closed.emit();
    }
  }

  // Handle backdrop click
  protected onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdropClick() && event.target === event.currentTarget) {
      this.close();
    }
  }

  // Handle escape key press
  @HostListener('document:keydown.escape', ['$event'])
  protected onEscapeKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.closeOnEscape() && this.isOpen()) {
      keyboardEvent.preventDefault();
      this.close();
    }
  }

  // Prevent body scroll when modal is open
  constructor() {
    effect(() => {
      if (this.isBrowser) {
        if (this.isOpen()) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      }
    });
  }
}
