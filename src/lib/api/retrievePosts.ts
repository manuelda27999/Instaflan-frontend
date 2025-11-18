"use server";

import { apiFetch } from "./utils";

export default async function retrievePosts() {
  const response = await apiFetch("/posts", {
    method: "GET",
    errorMessage: "Unexpected error while retrieving posts",
  });

  return response.json();
}
