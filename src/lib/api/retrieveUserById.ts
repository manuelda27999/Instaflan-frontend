"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function retrieveUserById(userIdProfile: string) {
  validateId(userIdProfile);

  const response = await apiFetch(`/users/${userIdProfile}`, {
    method: "GET",
    errorMessage: "Unexpected error while retrieving the user",
  });

  return response.json();
}
