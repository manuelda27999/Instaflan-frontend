"use server";

import { apiFetch } from "./utils";
import { validateText } from "../helpers/validators";

interface User {
  id: string;
  name: string;
  image: string;
}

export default async function searchUser(text: string): Promise<User[]> {
  validateText(text);

  const trimmedText = text.trim();
  if (!trimmedText) {
    throw new Error(
      "Search text must contain at least one non-space character."
    );
  }

  const response = await apiFetch(
    `/search/${encodeURIComponent(trimmedText)}`,
    {
      method: "GET",
      errorMessage: "Unexpected error searching users",
    }
  );

  return response.json();
}
