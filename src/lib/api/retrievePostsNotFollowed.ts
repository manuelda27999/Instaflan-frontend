"use server";

import { apiFetch } from "./utils";

export default async function retrievePostsNotFollowed() {
  const response = await apiFetch("/explorer/posts", {
    method: "GET",
    errorMessage: "Unexpected error while retrieving explorer posts",
  });

  return response.json();
}
