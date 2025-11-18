"use server";

import { apiFetch } from "./utils";

export default async function numberChatsNotReading(): Promise<number> {
  const response = await apiFetch("/chats-not-reading", {
    method: "GET",
    errorMessage: "Unexpected error while retrieving chats not read count",
  });

  return response.json();
}
