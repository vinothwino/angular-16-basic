import { Component, input, output } from '@angular/core';
import { Modal } from '../shared/components/modal/modal';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-user-modal',
  imports: [Modal, ReactiveFormsModule],
  templateUrl: './add-user-modal.html',
  styleUrl: './add-user-modal.css',
})
export class AddUserModal {
  public readonly isCreateModalOpen = input<boolean>(false);
  readonly closed = output<void>();

  protected readonly createModalTitle = "Create User";

  public readonly createUserForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
  });

  readonly createUser = output<Partial<{
    name: string | null;
    email: string | null;
    phone: string | null;
    role: string | null;
    status: string | null;
  }>>();

  protected createUserHandler(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    // Mark all fields as touched to show validation errors
    this.createUserForm.markAllAsTouched();

    if (this.createUserForm.invalid) {
      return;
    }
    this.createUser.emit(this.createUserForm.value);

    // Reset form after successful submission
    this.createUserForm.reset();
  }

}
