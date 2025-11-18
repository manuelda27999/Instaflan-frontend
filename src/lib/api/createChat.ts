"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function createChat(otherUser: string) {
  validateId(otherUser);

  const response = await apiFetch("/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otherUser }),
    errorMessage: "Unexpected error creating chat",
  });

  return response.json();
}
