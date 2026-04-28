import mongoose from "mongoose";
import { Post } from "../models/Post.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { postsToCsv } from "../utils/csv.js";
import { buildPostQuery, getPagination, getSort } from "../utils/postQuery.js";
import { normalizePostPayload, validatePostPayload } from "../validators/postValidator.js";

const findPostById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "Post not found.");
  }

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, "Post not found.");
  }

  return post;
};

export const getPosts = asyncHandler(async (request, response) => {
  const query = buildPostQuery(request.query);
  const { page, limit, skip } = getPagination(request.query);
  const sort = getSort(request.query.sort);

  const [posts, total] = await Promise.all([
    Post.find(query).sort(sort).skip(skip).limit(limit),
    Post.countDocuments(query)
  ]);

  response.json({
    data: posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1
    }
  });
});

export const searchPosts = asyncHandler(async (request, response) => {
  request.query.search = request.query.query || request.query.search;
  return getPosts(request, response);
});

export const getPostById = asyncHandler(async (request, response) => {
  const post = await findPostById(request.params.id);
  response.json(post);
});

export const createPost = asyncHandler(async (request, response) => {
  const payload = normalizePostPayload(request.body);
  validatePostPayload(payload);

  const post = await Post.create(payload);
  response.status(201).json(post);
});

export const updatePost = asyncHandler(async (request, response) => {
  const post = await findPostById(request.params.id);
  const payload = normalizePostPayload(request.body);
  validatePostPayload(payload);

  Object.assign(post, payload);
  const updatedPost = await post.save();

  response.json(updatedPost);
});

export const deletePost = asyncHandler(async (request, response) => {
  const post = await findPostById(request.params.id);
  await post.deleteOne();

  response.json({ message: "Post deleted successfully." });
});

export const exportPostsCsv = asyncHandler(async (request, response) => {
  const query = buildPostQuery(request.query);
  const posts = await Post.find(query).sort(getSort(request.query.sort)).lean();
  const csv = postsToCsv(posts);

  response.setHeader("Content-Type", "text/csv; charset=utf-8");
  response.setHeader("Content-Disposition", "attachment; filename=blog-posts.csv");
  response.send(csv);
});
