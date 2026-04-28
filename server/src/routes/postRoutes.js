import { Router } from "express";
import {
  createPost,
  deletePost,
  exportPostsCsv,
  getPostById,
  getPosts,
  searchPosts,
  updatePost
} from "../controllers/postController.js";

const router = Router();

router.get("/", getPosts);
router.get("/search", searchPosts);
router.get("/export/csv", exportPostsCsv);
router.post("/", createPost);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
