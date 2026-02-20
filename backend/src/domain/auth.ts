export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  sub: string;
  email: string;
  type: "access" | "refresh";
  iat?: number;
  exp?: number;
}
