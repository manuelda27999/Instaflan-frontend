"use server";

import { apiFetch } from "./utils";

export default async function retrieveUser() {
  const response = await apiFetch("/users", {
    method: "GET",
    errorMessage: "Unexpected error while retrieving the user",
  });

  return response.json();
}
