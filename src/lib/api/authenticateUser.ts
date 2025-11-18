"use server";

import { apiFetch } from "./utils";
import { createSession } from "../helpers/session";
import { validateEmail, validatePassword } from "../helpers/validators";

export default async function authenticateUser(
  _prevState: unknown,
  formData: FormData
): Promise<void> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Invalid credentials payload.");
  }

  validateEmail(email);
  validatePassword(password);

  const response = await apiFetch("/users/auth", {
    method: "POST",
    auth: false,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const body = await response.json();

  await createSession(body);
}
