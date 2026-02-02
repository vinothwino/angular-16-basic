import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, throwError } from 'rxjs';
import { User, UserFormData } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly usersSubject = new BehaviorSubject<User[]>([
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            role: 'admin',
            status: 'active',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '0987654321',
            role: 'user',
            status: 'active',
            createdAt: new Date('2024-02-01'),
            updatedAt: new Date('2024-02-01'),
        },
        {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob.johnson@example.com',
            phone: '5555555555',
            role: 'guest',
            status: 'inactive',
            createdAt: new Date('2024-02-10'),
            updatedAt: new Date('2024-02-10'),
        },
        {
            id: 4,
            name: 'Alice Williams',
            email: 'alice.williams@example.com',
            phone: '4444444444',
            role: 'user',
            status: 'active',
            createdAt: new Date('2024-02-15'),
            updatedAt: new Date('2024-02-15'),
        },
        {
            id: 5,
            name: 'Charlie Brown',
            email: 'charlie.brown@example.com',
            phone: '3333333333',
            role: 'user',
            status: 'active',
            createdAt: new Date('2024-02-20'),
            updatedAt: new Date('2024-02-20'),
        },
    ]);
    public readonly users$ = this.usersSubject.asObservable();

    /**
     * Get all users as Observable
     */
    getUsers$(): Observable<User[]> {
        // Simulate API call with delay
        return of([...this.usersSubject.value]).pipe(delay(300));
    }

    /**
     * Get user by ID
     */
    getUserById(id: number): Observable<User | undefined> {
        const user = this.usersSubject.value.find((u) => u.id === id);
        if (user) {
            return of(user).pipe(delay(200));
        }
        return throwError(() => new Error(`User with id ${id} not found`));
    }

    /**
     * Create a new user
     */
    createUser(userData: UserFormData): Observable<User> {
        const newUser: User = {
            id: this.getNextId(),
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([...currentUsers, newUser]);

        return of(newUser).pipe(delay(300));
    }

    /**
     * Update an existing user
     */
    updateUser(id: number, userData: Partial<UserFormData>): Observable<User> {
        const currentUsers = this.usersSubject.value;
        const userIndex = currentUsers.findIndex((u) => u.id === id);

        if (userIndex === -1) {
            return throwError(() => new Error(`User with id ${id} not found`));
        }

        const updatedUser: User = {
            ...currentUsers[userIndex],
            ...userData,
            updatedAt: new Date(),
        };

        const updatedUsers = [...currentUsers];
        updatedUsers[userIndex] = updatedUser;
        this.usersSubject.next(updatedUsers);

        return of(updatedUser).pipe(delay(300));
    }

    /**
     * Delete a user
     */
    deleteUser(id: number): Observable<boolean> {
        const currentUsers = this.usersSubject.value;
        const filteredUsers = currentUsers.filter((u) => u.id !== id);
        console.log(id, currentUsers, filteredUsers, "id");

        if (filteredUsers.length === currentUsers.length) {
            return throwError(() => new Error(`User with id ${id} not found`));
        }

        this.usersSubject.next(filteredUsers);
        return of(true).pipe(delay(300));
    }

    /**
     * Get the next available ID
     */
    private getNextId(): number {
        const users = this.usersSubject.value;
        return users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    }
}
