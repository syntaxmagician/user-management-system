import { pool } from "./pool";
import type { IUserRepository } from "../../domain/repositories";
import type { User, UserCreateInput, UserUpdateInput } from "../../domain/user";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    name: row.name as string,
    passwordHash: row.password_hash as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    deletedAt: row.deleted_at ? new Date(row.deleted_at as string) : null,
  };
}

export const userRepository: IUserRepository = {
  async create(input: UserCreateInput): Promise<User> {
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const result = await pool.query(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, password_hash, created_at, updated_at, deleted_at`,
      [input.email.trim().toLowerCase(), input.name.trim(), passwordHash]
    );
    return rowToUser(result.rows[0]);
  },

  async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT id, email, name, password_hash, created_at, updated_at, deleted_at
       FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    if (result.rows.length === 0) return null;
    return rowToUser(result.rows[0]);
  },

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT id, email, name, password_hash, created_at, updated_at, deleted_at
       FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [email.trim().toLowerCase()]
    );
    if (result.rows.length === 0) return null;
    return rowToUser(result.rows[0]);
  },

  async findMany(params: { limit: number; offset: number; search?: string }): Promise<{ users: User[]; total: number }> {
    const search = params.search?.trim();
    const searchPattern = search ? `%${search.toLowerCase()}%` : null;
    const countQuery = searchPattern
      ? `SELECT COUNT(*)::int AS total FROM users WHERE deleted_at IS NULL AND (LOWER(name) LIKE $1 OR LOWER(email) LIKE $1)`
      : `SELECT COUNT(*)::int AS total FROM users WHERE deleted_at IS NULL`;
    const countResult = await pool.query(countQuery, searchPattern ? [searchPattern] : []);
    const total = (countResult.rows[0] as { total: number }).total;

    const listQuery = searchPattern
      ? `SELECT id, email, name, password_hash, created_at, updated_at, deleted_at
         FROM users WHERE deleted_at IS NULL AND (LOWER(name) LIKE $3 OR LOWER(email) LIKE $3)
         ORDER BY created_at DESC LIMIT $1 OFFSET $2`
      : `SELECT id, email, name, password_hash, created_at, updated_at, deleted_at
         FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    const listArgs = searchPattern ? [params.limit, params.offset, searchPattern] : [params.limit, params.offset];
    const listResult = await pool.query(listQuery, listArgs);
    const users = listResult.rows.map(rowToUser);
    return { users, total };
  },

  async update(id: string, input: UserUpdateInput): Promise<User | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;
    if (input.email !== undefined) {
      updates.push(`email = $${idx++}`);
      values.push(input.email.trim().toLowerCase());
    }
    if (input.name !== undefined) {
      updates.push(`name = $${idx++}`);
      values.push(input.name.trim());
    }
    if (input.password !== undefined) {
      updates.push(`password_hash = $${idx++}`);
      values.push(await bcrypt.hash(input.password, SALT_ROUNDS));
    }
    if (updates.length === 0) return existing;
    updates.push(`updated_at = NOW()`);
    values.push(id);
    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${idx} AND deleted_at IS NULL RETURNING id, email, name, password_hash, created_at, updated_at, deleted_at`;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;
    return rowToUser(result.rows[0]);
  },

  async delete(id: string): Promise<boolean> {
    const result = await pool.query(
      `UPDATE users SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  },
};
