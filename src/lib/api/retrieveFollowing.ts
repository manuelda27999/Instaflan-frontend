"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function retrieveFollowing(userIdProfile: string) {
  validateId(userIdProfile);

  const response = await apiFetch(`/users/${userIdProfile}/following`, {
    method: "GET",
    errorMessage: "Unexpected error while retrieving following users",
  });

  return response.json();
}
