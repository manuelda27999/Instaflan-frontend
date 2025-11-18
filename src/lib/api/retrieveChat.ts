"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function retrieveChat(chatId: string) {
  validateId(chatId);

  const response = await apiFetch(`/chats/${chatId}`, {
    method: "GET",
    errorMessage: "Unexpected error while retrieving the chat",
  });

  return response.json();
}
