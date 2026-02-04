import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetails } from './todo-details';
import { provideRouter } from '@angular/router';

describe('TodoDetails', () => {
  let component: TodoDetails;
  let fixture: ComponentFixture<TodoDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoDetails],
      providers: [provideRouter([{ path: 'todo/:id', component: TodoDetails }]),]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TodoDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
