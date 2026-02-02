import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserModal } from './add-user-modal';
import { inputBinding } from '@angular/core';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

describe('AddUserModal', () => {
  let component: AddUserModal;
  let fixture: ComponentFixture<AddUserModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserModal],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddUserModal, {
      bindings: [
        inputBinding('isCreateModalOpen', () => true),
      ],
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render the component', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Create User');
    expect(fixture.nativeElement.querySelector('button[aria-label="Close modal"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('form')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('input#username')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('input#email')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('input#phone')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('select#role')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('select#status')).toBeTruthy();
  });

  it('should create a new user when the form is submitted', () => {
    const mockCreateUserForm = vi.spyOn(component.createUser, 'emit');
    const form = fixture.nativeElement.querySelector('form');
    const nameInput = form.querySelector('input#username') as HTMLInputElement;
    nameInput.value = 'John Doe';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));

    const emailInput = form.querySelector('input#email') as HTMLInputElement;
    emailInput.value = 'john.doe@example.com';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));

    const phoneInput = form.querySelector('input#phone') as HTMLInputElement;
    phoneInput.value = '1234567890';
    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

    const roleSelect = form.querySelector('select#role') as HTMLSelectElement;
    roleSelect.value = 'admin';
    roleSelect.dispatchEvent(new Event('change', { bubbles: true }));

    const statusSelect = form.querySelector('select#status') as HTMLSelectElement;
    statusSelect.value = 'active';
    statusSelect.dispatchEvent(new Event('change', { bubbles: true }));

    form.submit();
    expect(component.createUserForm.invalid).toBe(false);
    form.dispatchEvent(new Event('submit', { bubbles: true }));
    expect(mockCreateUserForm).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      role: 'admin',
      status: 'active',
    });
  });
});
