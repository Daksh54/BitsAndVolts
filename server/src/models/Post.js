import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      minlength: [5, "Title must be at least 5 characters."],
      maxlength: [120, "Title cannot exceed 120 characters."]
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    author: {
      type: String,
      required: [true, "Author is required."],
      trim: true,
      minlength: [2, "Author must be at least 2 characters."],
      maxlength: [80, "Author cannot exceed 80 characters."]
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      trim: true,
      minlength: [2, "Category must be at least 2 characters."],
      maxlength: [50, "Category cannot exceed 50 characters."]
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [240, "Excerpt cannot exceed 240 characters."]
    },
    content: {
      type: String,
      required: [true, "Content is required."],
      trim: true,
      minlength: [50, "Content must be at least 50 characters."]
    },
    coverImage: {
      type: String,
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft"
    },
    readTime: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

postSchema.index({ title: "text", author: "text", category: "text" });
postSchema.index({ category: 1, status: 1, createdAt: -1 });

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

postSchema.pre("validate", function setDerivedFields(next) {
  if (this.isModified("title") || !this.slug) {
    const baseSlug = slugify(this.title || "post");
    this.slug = `${baseSlug}-${Date.now().toString(36)}`;
  }

  if (this.isModified("content") || !this.readTime) {
    const wordCount = (this.content || "").trim().split(/\s+/).filter(Boolean).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  this.tags = [...new Set((this.tags || []).map((tag) => tag.trim()).filter(Boolean))];

  next();
});

export const Post = mongoose.model("Post", postSchema);
