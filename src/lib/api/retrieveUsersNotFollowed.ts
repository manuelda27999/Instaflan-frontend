"use server";

import { apiFetch } from "./utils";

export default async function retrieveUsersNotFollowed() {
  const response = await apiFetch("/explorer/users", {
    method: "GET",
    errorMessage: "Unexpected error while retrieving users not followed",
  });

  return response.json();
}
