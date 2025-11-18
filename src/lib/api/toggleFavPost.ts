"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function toggleFavPost(postId: string): Promise<void> {
  validateId(postId);

  await apiFetch(`/posts/${postId}`, {
    method: "PUT",
    errorMessage: "Unexpected error while toggling favorite post",
  });
}
