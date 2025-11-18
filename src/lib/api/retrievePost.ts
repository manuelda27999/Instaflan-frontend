"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function retrievePost(postId: string) {
  validateId(postId);

  const response = await apiFetch(`/posts/${postId}`, {
    method: "GET",
    errorMessage: "Unexpected error while retrieving the post",
  });

  return response.json();
}
