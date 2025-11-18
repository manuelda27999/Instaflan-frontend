"use server";

import { apiFetch } from "./utils";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../helpers/validators";

export default async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<void> {
  validateName(name);
  validateEmail(email);
  validatePassword(password);

  await apiFetch("/users", {
    method: "POST",
    auth: false,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
    errorMessage: "Unexpected error while registering",
  });
}
