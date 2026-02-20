import { userRepository } from "../infrastructure/database/user-repository";
import { refreshTokenStore } from "../infrastructure/redis/refresh-token-store";
import { signAccessToken, signRefreshToken, verifyRefreshToken, getRefreshTokenExpirationSeconds } from "../infrastructure/auth/jwt";
import type { AuthTokens } from "../domain/auth";
import { AppError, ErrorCodes } from "../shared/errors";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthTokens> {
    const email = input.email.trim().toLowerCase();
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError(ErrorCodes.CONFLICT, "Email sudah terdaftar", 409);
    }
    const user = await userRepository.create({
      email,
      name: input.name.trim(),
      password: input.password,
    });
    const { token: accessToken, expiresIn } = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
    const tokenId = randomUUID();
    await refreshTokenStore.set(user.id, tokenId, getRefreshTokenExpirationSeconds());
    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  },

  async login(input: LoginInput): Promise<AuthTokens> {
    const email = input.email.trim().toLowerCase();
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(ErrorCodes.UNAUTHORIZED, "Email atau password salah", 401);
    }
    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new AppError(ErrorCodes.UNAUTHORIZED, "Email atau password salah", 401);
    }
    const { token: accessToken, expiresIn } = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
    await refreshTokenStore.set(user.id, refreshToken, getRefreshTokenExpirationSeconds());
    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const payload = verifyRefreshToken(refreshToken);
    const stored = await refreshTokenStore.get(payload.sub);
    if (!stored) {
      throw new AppError(ErrorCodes.UNAUTHORIZED, "Refresh token tidak valid atau kedaluwarsa", 401);
    }
    const user = await userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError(ErrorCodes.UNAUTHORIZED, "User tidak ditemukan", 401);
    }
    const { token: accessToken, expiresIn } = signAccessToken({ sub: user.id, email: user.email });
    const newRefreshToken = signRefreshToken({ sub: user.id, email: user.email });
    await refreshTokenStore.set(user.id, newRefreshToken, getRefreshTokenExpirationSeconds());
    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    };
  },
};
