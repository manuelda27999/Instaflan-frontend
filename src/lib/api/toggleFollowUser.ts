"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function toggleFollowUser(
  userIdProfile: string
): Promise<void> {
  validateId(userIdProfile);

  await apiFetch(`/users/${userIdProfile}`, {
    method: "PUT",
    errorMessage: "Unexpected error while toggling follow state",
  });
}
