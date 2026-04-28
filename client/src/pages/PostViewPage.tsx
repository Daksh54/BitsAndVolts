import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { Avatar, Button, Chip } from "@mui/material";
import { deletePost, fetchPost } from "../api/posts";
import { getErrorMessage } from "../api/http";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { LoadingState } from "../components/LoadingState";
import { StatusChip } from "../components/StatusChip";
import { useNotification } from "../components/NotificationProvider";
import type { Post } from "../types/post";
import { formatDate, getInitials } from "../utils/format";

export const PostViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/");
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

  const handleDelete = async () => {
    if (!post) {
      return;
    }

    try {
      await deletePost(post._id);
      notify("Post deleted successfully.");
      navigate("/");
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  if (loading) {
    return <LoadingState label="Loading post details" />;
  }

  if (!post) {
    return null;
  }

  const tags = Array.isArray(post.tags) ? post.tags : [];
  const content = post.content || "";

  return (
    <article className="detail-page">
      <div className="detail-toolbar">
        <Button color="inherit" startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate("/")}>
          Back to posts
        </Button>
        <div className="detail-actions">
          <Button component={Link} to={`/posts/${post._id}/edit`} variant="outlined" startIcon={<EditOutlinedIcon />}>
            Edit
          </Button>
          <Button color="error" variant="contained" startIcon={<DeleteOutlineIcon />} onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <header className="detail-hero">
        {post.coverImage ? (
          <img src={post.coverImage} alt="" className="detail-cover" />
        ) : (
          <div className="detail-cover-placeholder" aria-hidden="true">
            <ArticleOutlinedIcon />
          </div>
        )}

        <div className="detail-headline">
          <div className="detail-kicker">
            <Chip label={post.category} className="category-chip" size="small" />
            <StatusChip status={post.status} />
          </div>
          <h1>{post.title}</h1>
          {post.excerpt && <p>{post.excerpt}</p>}
        </div>
      </header>

      <section className="detail-meta-strip" aria-label="Post metadata">
        <div className="author-lockup">
          <Avatar className="author-avatar">{getInitials(post.author)}</Avatar>
          <div>
            <strong>{post.author}</strong>
            <span>Updated {formatDate(post.updatedAt)}</span>
          </div>
        </div>
        <div className="read-time">
          <ScheduleOutlinedIcon fontSize="small" />
          <span>{post.readTime} min read</span>
        </div>
      </section>

      <section className="detail-content">
        {content.split("\n").map((paragraph, index) => (
          <p key={`${post._id}-${index}`}>{paragraph}</p>
        ))}
      </section>

      {tags.length > 0 && (
        <footer className="tag-row" aria-label="Post tags">
          {tags.map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </footer>
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="Delete post"
        description={`This will permanently delete "${post.title}".`}
        confirmLabel="Delete"
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </article>
  );
};
