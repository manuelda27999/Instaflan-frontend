"use server";

import { apiFetch } from "./utils";

export default async function retrieveChats() {
  const response = await apiFetch("/chats", {
    method: "GET",
    errorMessage: "Unexpected error while retrieving chats",
  });

  return response.json();
}
