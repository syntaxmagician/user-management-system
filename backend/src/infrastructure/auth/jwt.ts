import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "../../shared/config";
import type { JwtPayload } from "../../domain/auth";

function parseExpiresInSeconds(s: string): number {
  if (s.endsWith("d")) return parseInt(s, 10) * 24 * 60 * 60;
  if (s.endsWith("h")) return parseInt(s, 10) * 60 * 60;
  if (s.endsWith("m")) return parseInt(s, 10) * 60;
  return parseInt(s, 10);
}

export function signAccessToken(payload: { sub: string; email: string }): { token: string; expiresIn: number } {
  const expiresInSeconds = parseExpiresInSeconds(config.jwt.accessExpiresIn);
  const options: SignOptions = { expiresIn: expiresInSeconds };
  const token = jwt.sign(
    { ...payload, type: "access" },
    config.jwt.accessSecret as jwt.Secret,
    options
  );
  return { token, expiresIn: expiresInSeconds };
}

export function signRefreshToken(payload: { sub: string; email: string }): string {
  const expiresInSeconds = parseExpiresInSeconds(config.jwt.refreshExpiresIn);
  const options: SignOptions = { expiresIn: expiresInSeconds };
  return jwt.sign(
    { ...payload, type: "refresh" },
    config.jwt.refreshSecret as jwt.Secret,
    options
  );
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
  if (decoded.type !== "access") throw new Error("Invalid token type");
  return decoded;
}

export function verifyRefreshToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
  if (decoded.type !== "refresh") throw new Error("Invalid token type");
  return decoded;
}

export function getRefreshTokenExpirationSeconds(): number {
  const s = config.jwt.refreshExpiresIn;
  if (s.endsWith("d")) return parseInt(s, 10) * 24 * 60 * 60;
  if (s.endsWith("h")) return parseInt(s, 10) * 60 * 60;
  if (s.endsWith("m")) return parseInt(s, 10) * 60;
  return parseInt(s, 10);
}
