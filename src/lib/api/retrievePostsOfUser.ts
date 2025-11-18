"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function retrievePostsOfUser(userIdProfile: string) {
  validateId(userIdProfile);

  const response = await apiFetch(`/users/${userIdProfile}/posts`, {
    method: "GET",
    errorMessage: "Unexpected error while retrieving user posts",
  });

  return response.json();
}
