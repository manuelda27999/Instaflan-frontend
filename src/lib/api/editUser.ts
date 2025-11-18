"use server";

import { apiFetch } from "./utils";
import { validateImage, validateText, validateName } from "../helpers/validators";

export default async function editUser(
  name: string,
  image: string,
  description: string
): Promise<void> {
  validateName(name);
  validateImage(image);
  validateText(description);

  await apiFetch("/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, image, description }),
    errorMessage: "Unexpected error while editing the user",
  });
}
