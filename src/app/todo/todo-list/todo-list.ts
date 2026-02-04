import { Component, inject, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  imports: [RouterLink],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {
  private readonly todoService = inject(TodoService);
  protected readonly router = inject(Router);
  public readonly todos = toSignal(this.todoService.getTodos$(), { initialValue: [] });

}
