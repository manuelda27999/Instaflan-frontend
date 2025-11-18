"use server";

import "server-only";
import { cookies } from "next/headers";

export async function createSession(token: string): Promise<void> {
  const expiresAtSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: true,
    expires: expiresAtSevenDays,
  });
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete("session");
}
