"use server";

const MAX_LIMIT = 3;

export async function fetchPosts(page: number) {
  const response = await fetch(
    `/api/posts?page=${page}&limit=${MAX_LIMIT}`
  );

  const data = await response.json();

  return data;
}