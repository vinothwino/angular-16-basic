# Modal Component

A reusable, accessible modal component for Angular applications.

## Features

- ✅ Modern Angular signals API
- ✅ Content projection (ng-content)
- ✅ Multiple sizes (sm, md, lg, xl)
- ✅ Close on backdrop click (configurable)
- ✅ Close on Escape key (configurable)
- ✅ Accessible (ARIA attributes)
- ✅ Animations
- ✅ Responsive design
- ✅ Prevents body scroll when open

## Usage

### Basic Example

```typescript
import { Component, signal } from '@angular/core';
import { Modal } from '../shared/components/modal/modal';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [Modal],
  template: `
    <button (click)="isModalOpen.set(true)">Open Modal</button>
    
    <app-modal 
      [isOpen]="isModalOpen()" 
      [title]="'My Modal Title'"
      (closed)="isModalOpen.set(false)">
      <p>This is the modal content!</p>
      
      <div footer>
        <button (click)="isModalOpen.set(false)">Close</button>
      </div>
    </app-modal>
  `
})
export class Example {
  isModalOpen = signal(false);
}
```

### Advanced Example with All Options

```typescript
<app-modal 
  [isOpen]="isModalOpen()" 
  [title]="'User Details'"
  [size]="'lg'"
  [showCloseButton]="true"
  [closeOnBackdropClick]="true"
  [closeOnEscape]="true"
  (closed)="isModalOpen.set(false)">
  
  <!-- Main content -->
  <div>
    <p>User information goes here...</p>
  </div>
  
  <!-- Footer content (use [footer] attribute) -->
  <div footer>
    <button (click)="save()">Save</button>
    <button (click)="isModalOpen.set(false)">Cancel</button>
  </div>
</app-modal>
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls modal visibility |
| `title` | `string` | `'Modal Title'` | Modal header title |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Modal size |
| `showCloseButton` | `boolean` | `true` | Show/hide close button |
| `closeOnBackdropClick` | `boolean` | `true` | Close when clicking backdrop |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key press |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| `closed` | `void` | Emitted when modal is closed |

## Content Projection

- **Default slot**: Main content goes in the body
- **Footer slot**: Use `[footer]` attribute for footer content

```html
<app-modal [isOpen]="true">
  <!-- Body content -->
  <p>Main content here</p>
  
  <!-- Footer content -->
  <div footer>
    <button>Action</button>
  </div>
</app-modal>
```

## Styling

The modal uses CSS classes that can be customized:
- `.modal-backdrop` - Backdrop overlay
- `.modal-container` - Modal container
- `.modal-content` - Content wrapper
- `.modal-header` - Header section
- `.modal-body` - Body section
- `.modal-footer` - Footer section

## Accessibility

- ARIA attributes for screen readers
- Keyboard navigation (Escape to close)
- Focus management
- Proper dialog role
