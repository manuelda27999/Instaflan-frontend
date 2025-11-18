"use server";

import { apiFetch } from "./utils";
import { validateId } from "../helpers/validators";

export default async function deleteNotification(
  notificationId: string
): Promise<void> {
  validateId(notificationId);

  await apiFetch(`/notifications/${notificationId}`, {
    method: "DELETE",
    errorMessage: "Unexpected error while deleting the notification",
  });
}
