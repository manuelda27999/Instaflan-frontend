"use server";

import { apiFetch } from "./utils";

export default async function retrieveNotifications() {
  const response = await apiFetch("/notifications", {
    method: "GET",
    errorMessage: "Unexpected error while retrieving notifications",
  });

  return response.json();
}
