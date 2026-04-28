import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { Post, PostPayload, PostStatus } from "../types/post";

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) {
      return true;
    }

    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  }, "Enter a valid http or https URL.");

const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(120, "Title cannot exceed 120 characters."),
  author: z
    .string()
    .trim()
    .min(2, "Author must be at least 2 characters.")
    .max(80, "Author cannot exceed 80 characters."),
  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters.")
    .max(50, "Category cannot exceed 50 characters."),
  excerpt: z.string().trim().max(240, "Excerpt cannot exceed 240 characters."),
  coverImage: optionalUrl,
  tags: z.string().trim().max(240, "Tags cannot exceed 240 characters."),
  status: z.enum(["Draft", "Published", "Archived"]),
  content: z
    .string()
    .trim()
    .min(50, "Content must be at least 50 characters.")
    .max(10000, "Content cannot exceed 10000 characters.")
});

export type PostFormFields = z.infer<typeof postSchema>;

interface PostFormProps {
  initialPost?: Post;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: PostPayload) => Promise<void>;
}

const defaultValues: PostFormFields = {
  title: "",
  author: "",
  category: "",
  excerpt: "",
  coverImage: "",
  tags: "",
  status: "Draft",
  content: ""
};

const toFormValues = (post?: Post): PostFormFields => {
  if (!post) {
    return defaultValues;
  }

  return {
    title: post.title,
    author: post.author,
    category: post.category,
    excerpt: post.excerpt || "",
    coverImage: post.coverImage || "",
    tags: post.tags.join(", "),
    status: post.status,
    content: post.content
  };
};

const toPayload = (values: PostFormFields): PostPayload => ({
  title: values.title.trim(),
  author: values.author.trim(),
  category: values.category.trim(),
  excerpt: values.excerpt.trim(),
  coverImage: values.coverImage.trim(),
  tags: values.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean),
  status: values.status as PostStatus,
  content: values.content.trim()
});

export const PostForm = ({ initialPost, isSubmitting, onCancel, onSubmit }: PostFormProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<PostFormFields>({
    resolver: zodResolver(postSchema),
    defaultValues: toFormValues(initialPost),
    mode: "onTouched"
  });

  useEffect(() => {
    reset(toFormValues(initialPost));
  }, [initialPost, reset]);

  return (
    <form className="post-form" onSubmit={handleSubmit((values) => onSubmit(toPayload(values)))}>
      <div className="form-grid">
        <TextField
          label="Title"
          placeholder="Write a clear post title"
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
          fullWidth
          {...register("title")}
        />
        <TextField
          label="Author"
          placeholder="Author name"
          error={Boolean(errors.author)}
          helperText={errors.author?.message}
          fullWidth
          {...register("author")}
        />
        <TextField
          label="Category"
          placeholder="Engineering, Product, UX"
          error={Boolean(errors.category)}
          helperText={errors.category?.message}
          fullWidth
          {...register("category")}
        />
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <FormControl fullWidth error={Boolean(errors.status)}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select labelId="status-label" label="Status" {...field}>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Published">Published</MenuItem>
                <MenuItem value="Archived">Archived</MenuItem>
              </Select>
              <FormHelperText>{errors.status?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </div>

      <TextField
        label="Excerpt"
        placeholder="Short summary for list and detail pages"
        error={Boolean(errors.excerpt)}
        helperText={errors.excerpt?.message || "Maximum 240 characters."}
        fullWidth
        multiline
        minRows={2}
        {...register("excerpt")}
      />

      <TextField
        label="Cover image URL"
        placeholder="https://example.com/image.jpg"
        error={Boolean(errors.coverImage)}
        helperText={errors.coverImage?.message || "Optional. Use a public http or https image URL."}
        fullWidth
        {...register("coverImage")}
      />

      <TextField
        label="Tags"
        placeholder="api, react, product"
        error={Boolean(errors.tags)}
        helperText={errors.tags?.message || "Separate tags with commas."}
        fullWidth
        {...register("tags")}
      />

      <TextField
        label="Content"
        placeholder="Write the full blog post content"
        error={Boolean(errors.content)}
        helperText={errors.content?.message || "Minimum 50 characters."}
        fullWidth
        multiline
        minRows={10}
        {...register("content")}
      />

      <div className="form-actions">
        <Button
          type="button"
          variant="outlined"
          color="inherit"
          startIcon={<CloseOutlinedIcon />}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" startIcon={<SaveOutlinedIcon />} disabled={isSubmitting}>
          {isSubmitting ? "Saving" : "Save Post"}
        </Button>
      </div>
    </form>
  );
};
