import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/todos';
  private readonly todosSubject = new BehaviorSubject<Todo[]>([]);
  public readonly todos$ = this.todosSubject.asObservable();

  constructor() {
    this.http.get<Todo[]>(this.baseUrl).subscribe((todos) => {
      this.todosSubject.next(todos);
    });
  }

  getTodos$(): Observable<Todo[]> {
    return of(this.todosSubject.value).pipe(delay(300));
  }

  getTodoById$(id: number): Observable<Todo | undefined> {
    return this.todos$.pipe(
      map((todos) => todos.find((todo) => todo.id === +id)),
    );
  }

  updateTodo$(id: number, todo: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseUrl}/${id}`, todo).pipe(
      map((updatedTodo: Todo) => {
        this.todosSubject.next(this.todosSubject.value.map((t) => t.id === id ? updatedTodo : t));
        return updatedTodo;
      }),
    );
  }

  deleteTodo$(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      map(() => {
        this.todosSubject.next(this.todosSubject.value.filter((t) => t.id !== id));
      }),
    );
  }
}
