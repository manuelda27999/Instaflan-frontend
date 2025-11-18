"use server";

import { apiFetch } from "./utils";
import { validateId, validateText } from "../helpers/validators";

export default async function editMessage(
  messageId: string,
  text: string
): Promise<void> {
  validateId(messageId);
  validateText(text);

  await apiFetch(`/chats/${messageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
    errorMessage: "Unexpected error while editing the message",
  });
}
