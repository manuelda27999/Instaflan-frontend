"use server";

import { apiFetch } from "./utils";
import { validateId, validateImage, validateText } from "../helpers/validators";

export default async function editPost(
  postId: string,
  image: string,
  text: string
): Promise<void> {
  validateId(postId);
  validateImage(image);
  validateText(text);

  await apiFetch(`/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image, text }),
    errorMessage: "Unexpected error while editing the post",
  });
}
