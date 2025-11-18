"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function deleteMessage(messageId: string): Promise<void> {
  validateId(messageId);

  await apiFetch(`/chats/${messageId}`, {
    method: "PUT",
    errorMessage: "Unexpected error while deleting the message",
  });
}
