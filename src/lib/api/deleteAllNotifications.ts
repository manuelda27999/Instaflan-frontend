"use server";

import { apiFetch } from "./utils";

export default async function deleteAllNotifications(): Promise<void> {
  await apiFetch("/notifications", {
    method: "DELETE",
    errorMessage: "Unexpected error while deleting notifications",
  });
}
