import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modal } from './modal';
import { inputBinding } from '@angular/core';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal],
    })
      .compileComponents();

    fixture = TestBed.createComponent(Modal, {
      bindings: [
        inputBinding('title', () => 'Test Title'),
        inputBinding('isOpen', () => true),

      ],
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render the component', async () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain(component.title());
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });

  it('should emit "closed" when close button is clicked', async () => {
    const spy = vi.spyOn(component.closed, 'emit');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[aria-label="Close modal"]');
    button.click();
    expect(spy).toHaveBeenCalled();
  });
});
