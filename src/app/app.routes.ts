import { Routes } from '@angular/router';
import { Users } from './users/user-list/user-list';
import { TodoList } from './todo/todo-list/todo-list';
import { TodoDetails } from './todo/todo-details/todo-details';

export const routes: Routes = [
    { path: 'users', component: Users },
    { path: 'todos', component: TodoList },
    { path: 'todo/:id', component: TodoDetails },
];
