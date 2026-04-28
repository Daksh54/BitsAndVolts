import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Button } from "@mui/material";
import { createPost, fetchPost, updatePost } from "../api/posts";
import { getErrorMessage } from "../api/http";
import { LoadingState } from "../components/LoadingState";
import { PostForm } from "../components/PostForm";
import { useNotification } from "../components/NotificationProvider";
import type { Post, PostPayload } from "../types/post";

export const PostFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [post, setPost] = useState<Post | undefined>();
  const [loading, setLoading] = useState(Boolean(id));
  const [submitting, setSubmitting] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadPost = async () => {
      setLoading(true);

      try {
        setPost(await fetchPost(id));
      } catch (error) {
        notify(getErrorMessage(error), "error");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, navigate, notify]);

  const handleSubmit = async (payload: PostPayload) => {
    setSubmitting(true);

    try {
      const savedPost = id ? await updatePost(id, payload) : await createPost(payload);
      notify(isEditing ? "Post updated successfully." : "Post created successfully.");
      navigate(`/posts/${savedPost._id}`);
    } catch (error) {
      notify(getErrorMessage(error), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(id ? `/posts/${id}` : "/");
  };

  return (
    <section className="page-stack">
      <div className="page-header page-header-compact">
        <div>
          <p className="eyebrow">{isEditing ? "Edit Post" : "New Post"}</p>
          <h1>{isEditing ? "Refine the article details" : "Create a blog post"}</h1>
          <p className="page-description">
            Keep titles specific, summaries crisp, and content complete enough for readers to trust.
          </p>
        </div>
        <Button color="inherit" startIcon={<ArrowBackOutlinedIcon />} onClick={handleCancel}>
          Back
        </Button>
      </div>

      <section className="content-surface form-surface">
        {loading ? (
          <LoadingState label="Loading post" />
        ) : (
          <PostForm
            initialPost={post}
            isSubmitting={submitting}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        )}
      </section>
    </section>
  );
};
