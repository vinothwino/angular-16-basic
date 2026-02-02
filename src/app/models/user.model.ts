export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
