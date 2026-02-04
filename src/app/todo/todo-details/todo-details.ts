import { Component, inject, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-details',
  imports: [RouterLink],
  templateUrl: './todo-details.html',
  styleUrl: './todo-details.css',
})
export class TodoDetails {
  private readonly todoService = inject(TodoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly id = +this.route.snapshot.params['id'];
  public readonly todo = toSignal<Todo | undefined>(this.todoService.getTodoById$(this.id), { initialValue: null });
  public readonly title = signal<string>(this.todo()?.title ?? '');
  public readonly isEditing = signal<boolean>(false);
  public readonly isDeleting = signal<boolean>(false);

  public onTitleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.title.set(target.value);
  }

  public onEdit() {
    this.isEditing.set(true);
    this.todoService.updateTodo$(this.id, { title: this.title() }).subscribe({
      next: () => {
        this.isEditing.set(false);
      },
      error: (error) => {
        alert('Error updating todo');
        this.isEditing.set(false);
      },
    });
  }

  public onDelete() {
    this.isDeleting.set(true);
    this.todoService.deleteTodo$(this.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.router.navigate(['/todos']);
      },
      error: (error) => {
        alert('Error deleting todo');
        this.isDeleting.set(false);
      },
    });
  }
}
