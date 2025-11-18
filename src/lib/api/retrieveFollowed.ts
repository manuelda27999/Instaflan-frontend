"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function retrieveFollowed(userIdProfile: string) {
  validateId(userIdProfile);

  const response = await apiFetch(`/users/${userIdProfile}/followed`, {
    method: "GET",
    errorMessage: "Unexpected error while retrieving followed users",
  });

  return response.json();
}
