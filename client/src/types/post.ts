export type PostStatus = "Draft" | "Published" | "Archived";

export interface Post {
  _id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: PostStatus;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostPayload {
  title: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: PostStatus;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedPosts {
  data: Post[];
  pagination: Pagination;
}

export interface PostFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  author?: string;
  status?: string;
  sort?: string;
}
