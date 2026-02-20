import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth is handled client-side (Zustand + localStorage). Dashboard layout redirects to /login when unauthenticated.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = { matcher: [] };
