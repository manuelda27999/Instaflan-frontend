"use server";

import { apiFetch } from "./utils";
import { validateImage, validateText } from "../helpers/validators";

export default async function createNewPost(
  image: string,
  text: string
): Promise<void> {
  validateImage(image);
  validateText(text);

  await apiFetch("/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image, text }),
    errorMessage: "Unexpected error while creating the post",
  });
}
