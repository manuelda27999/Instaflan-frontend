"use server";

import "server-only";
import { cookies } from "next/headers";
import { validateToken } from "../helpers/validators";

type FetchOptions = RequestInit & {
  auth?: boolean;
  errorMessage?: string;
};

export async function requireSessionToken(): Promise<string> {
  const token = (await cookies()).get("session")?.value;

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  validateToken(token);
  return token;
}

export async function resolveApiUrl(): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(
      "API URL is not defined. Set API_URL (preferred) or NEXT_PUBLIC_API_URL."
    );
  }

  return apiUrl;
}

export async function apiFetch(
  path: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    auth = true,
    errorMessage = `Unexpected error calling ${path}`,
    headers,
    cache,
    ...rest
  } = options;

  const apiUrl = await resolveApiUrl();

  const finalHeaders = new Headers(headers);

  if (auth) {
    const token = await requireSessionToken();
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiUrl}${path}`, {
    cache: cache ?? "no-store",
    headers: finalHeaders,
    ...rest,
  });

  if (response.ok) {
    return response;
  }

  if (response.status === 400) {
    const body = await response.json();
    throw new Error(body.error);
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("Your session expired. Please log in and try again.");
  }

  throw new Error(`${errorMessage}. Status ${response.status}.`);
}
