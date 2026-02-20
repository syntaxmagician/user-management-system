export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserCreateInput {
  email: string;
  name: string;
  password: string;
}

export interface UserUpdateInput {
  email?: string;
  name?: string;
  password?: string;
}

export interface UserPublic {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function toPublicUser(u: User): UserPublic {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}
