import { UserRole } from '../../shared/constants.js';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithAuth extends User {
  accessToken: string;
  refreshToken: string;
}