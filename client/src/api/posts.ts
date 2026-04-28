import { api } from "./http";
import type { PaginatedPosts, Post, PostFilters, PostPayload } from "../types/post";

const compactParams = (params: PostFilters) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  );

export const fetchPosts = async (filters: PostFilters) => {
  const response = await api.get<PaginatedPosts>("/posts", {
    params: compactParams(filters)
  });
  return response.data;
};

export const fetchPost = async (id: string) => {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
};

export const createPost = async (payload: PostPayload) => {
  const response = await api.post<Post>("/posts", payload);
  return response.data;
};

export const updatePost = async (id: string, payload: PostPayload) => {
  const response = await api.put<Post>(`/posts/${id}`, payload);
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/posts/${id}`);
  return response.data;
};

export const exportPostsCsv = async (filters: PostFilters) => {
  const response = await api.get<Blob>("/posts/export/csv", {
    params: compactParams(filters),
    responseType: "blob"
  });

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "blog-posts.csv";
  anchor.click();
  URL.revokeObjectURL(url);
};
