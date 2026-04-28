import { ApiError } from "../utils/apiError.js";

const validStatuses = new Set(["Draft", "Published", "Archived"]);

const hasValidUrl = (value) => {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

export const normalizePostPayload = (body) => {
  const tags = Array.isArray(body.tags)
    ? body.tags
    : String(body.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

  return {
    title: String(body.title || "").trim(),
    author: String(body.author || "").trim(),
    category: String(body.category || "").trim(),
    excerpt: String(body.excerpt || "").trim(),
    content: String(body.content || "").trim(),
    coverImage: String(body.coverImage || "").trim(),
    tags,
    status: body.status || "Draft"
  };
};

export const validatePostPayload = (payload) => {
  const errors = [];

  if (payload.title.length < 5 || payload.title.length > 120) {
    errors.push("Title must be between 5 and 120 characters.");
  }

  if (payload.author.length < 2 || payload.author.length > 80) {
    errors.push("Author must be between 2 and 80 characters.");
  }

  if (payload.category.length < 2 || payload.category.length > 50) {
    errors.push("Category must be between 2 and 50 characters.");
  }

  if (payload.excerpt.length > 240) {
    errors.push("Excerpt cannot exceed 240 characters.");
  }

  if (payload.content.length < 50) {
    errors.push("Content must be at least 50 characters.");
  }

  if (!validStatuses.has(payload.status)) {
    errors.push("Status must be Draft, Published, or Archived.");
  }

  if (!hasValidUrl(payload.coverImage)) {
    errors.push("Cover image must be a valid http or https URL.");
  }

  if (payload.tags.some((tag) => tag.length > 30)) {
    errors.push("Each tag must be 30 characters or fewer.");
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors.join(" "));
  }
};
