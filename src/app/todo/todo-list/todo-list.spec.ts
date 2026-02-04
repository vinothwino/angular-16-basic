import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { TodoList } from './todo-list';
import { provideRouter, Router } from '@angular/router';
import { TodoDetails } from '../todo-details/todo-details';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Todo } from '../../models/todo.model';

describe('Todo List', () => {
  let component: TodoList;
  let fixture: ComponentFixture<TodoList>;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoList, TodoDetails],
      providers: [provideHttpClient(),
      provideHttpClientTesting(), provideRouter([
        { path: 'todos', component: TodoList },
        { path: 'todo/:id', component: TodoDetails }
      ])]
    })
      .compileComponents();

    harness = await RouterTestingHarness.create();
    fixture = TestBed.createComponent(TodoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render the todo list', async () => {
    await harness.navigateByUrl('/todos');

    const todoList: HTMLElement = fixture.nativeElement.querySelector('.todo-list');
    expect(todoList).toBeTruthy();
    expect(todoList.children.length).toBe(component.todos().length);
  });

  it.skip('should navigate to the todo details page', async () => {

    // mockTodoService.getTodos$.and.returnValue(of([{ id: 1, title: 'Test Todo' }]));

    await harness.navigateByUrl('/todos');
    const todoList: HTMLElement = fixture.nativeElement.querySelector('.todo-list');

    const todoItem: HTMLElement = todoList.children[0] as HTMLElement;
    // await todoItem.click();
    todoItem.dispatchEvent(new Event('click', { bubbles: true }));
    fixture.detectChanges()

    await harness.navigateByUrl('/todo/1');
    expect(harness.routeNativeElement).toBeTruthy();
  });
});
