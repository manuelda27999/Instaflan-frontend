"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function deletePost(postId: string): Promise<void> {
  validateId(postId);

  await apiFetch(`/posts/${postId}`, {
    method: "DELETE",
    errorMessage: "Unexpected error while deleting the post",
  });
}
