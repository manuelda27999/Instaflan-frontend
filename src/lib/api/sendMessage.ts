"use server";

import { apiFetch } from "./utils";
import { validateId, validateText } from "../helpers/validators";

export default async function sendMessage(chatId: string, text: string) {
  validateId(chatId);
  validateText(text);

  await apiFetch(`/chats/${chatId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
    errorMessage: "Unexpected error while sending the message",
  });
}
