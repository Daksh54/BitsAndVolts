import dotenv from "dotenv";
import { connectDatabase } from "../config/database.js";
import { Post } from "../models/Post.js";

dotenv.config();

const samplePosts = [
  {
    title: "Designing Reliable Product Dashboards",
    author: "Anaya Rao",
    category: "Product",
    excerpt: "A practical guide to shaping dashboards that support daily decisions without visual noise.",
    content:
      "A reliable dashboard starts with a clear question. Teams should see the metrics that change what they do today, not every metric the system can calculate. Group related numbers, show comparison context, and reserve bright colors for the few states that require attention.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tags: ["dashboards", "product", "analytics"],
    status: "Published"
  },
  {
    title: "API Pagination Patterns That Scale",
    author: "Rohan Mehta",
    category: "Engineering",
    excerpt: "How to keep collection endpoints predictable as datasets and interfaces grow.",
    content:
      "Pagination is more than a limit parameter. A useful API should validate page size, return total counts when affordable, and keep sort behavior stable. For admin dashboards and content tools, conventional page based pagination remains easy for users to understand.",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    tags: ["api", "node", "backend"],
    status: "Published"
  },
  {
    title: "Writing Content Forms People Can Finish",
    author: "Mira Shah",
    category: "UX",
    excerpt: "Validation, layout, and feedback patterns for long-form content creation.",
    content:
      "Content forms should feel calm even when there is a lot to enter. Keep required fields visible, explain validation at the field level, and preserve user progress after errors. A good edit screen makes the next action obvious without rushing the writer.",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    tags: ["forms", "ux", "content"],
    status: "Draft"
  }
];

const seed = async () => {
  await connectDatabase(process.env.MONGO_URI);

  for (const post of samplePosts) {
    const existingPost = await Post.findOne({ title: post.title, author: post.author });

    if (!existingPost) {
      await Post.create(post);
    }
  }

  console.log("Seeded sample blog posts.");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
