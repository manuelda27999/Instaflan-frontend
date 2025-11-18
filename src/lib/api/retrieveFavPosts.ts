"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function retrieveFavPosts(userIdProfile: string) {
  validateId(userIdProfile);

  const response = await apiFetch(`/users/${userIdProfile}/fav-posts`, {
    method: "GET",
    errorMessage: "Unexpected error while retrieving favorite posts",
  });

  return response.json();
}
