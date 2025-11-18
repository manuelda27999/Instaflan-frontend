"use server";

import { apiFetch } from "./utils";
import { validateId, validateText } from "../helpers/validators";

export default async function createComment(
  postId: string,
  text: string
): Promise<void> {
  validateId(postId);
  validateText(text);

  await apiFetch(`/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
    errorMessage: "Unexpected error while creating the comment",
  });
}
