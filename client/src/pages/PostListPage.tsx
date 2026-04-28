import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip
} from "@mui/material";
import { deletePost, exportPostsCsv, fetchPosts } from "../api/posts";
import { getErrorMessage } from "../api/http";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState, LoadingState } from "../components/LoadingState";
import { StatusChip } from "../components/StatusChip";
import { useNotification } from "../components/NotificationProvider";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type { Pagination, Post } from "../types/post";
import { formatDate } from "../utils/format";

const defaultPagination: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 1
};

export const PostListPage = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [loading, setLoading] = useState(true);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  const filters = useMemo(
    () => ({
      page: page + 1,
      limit,
      search: debouncedSearch,
      status,
      sort
    }),
    [debouncedSearch, limit, page, sort, status]
  );

  const loadPosts = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchPosts(filters);
      setPosts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      notify(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }, [filters, notify]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, limit, status, sort]);

  const handleDelete = async () => {
    if (!deletingPost) {
      return;
    }

    try {
      await deletePost(deletingPost._id);
      notify("Post deleted successfully.");
      setDeletingPost(null);
      loadPosts();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  const handleExport = async () => {
    try {
      await exportPostsCsv({
        search: debouncedSearch,
        status,
        sort
      });
      notify("CSV export started.");
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Blog Posts</p>
          <h1>Manage content from one focused workspace</h1>
          <p className="page-description">
            Search by title, author, or category. Review drafts, publish updates, and export filtered content.
          </p>
        </div>
        <Button component={Link} to="/posts/new" variant="contained" startIcon={<AddCircleOutlineIcon />}>
          Add Post
        </Button>
      </div>

      <section className="toolbar" aria-label="Post filters">
        <TextField
          className="toolbar-search"
          label="Search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Title, author, or category"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            )
          }}
        />

        <Select
          className="toolbar-select"
          displayEmpty
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by status"
        >
          <MenuItem value="">All statuses</MenuItem>
          <MenuItem value="Draft">Draft</MenuItem>
          <MenuItem value="Published">Published</MenuItem>
          <MenuItem value="Archived">Archived</MenuItem>
        </Select>

        <Select
          className="toolbar-select"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Sort posts"
        >
          <MenuItem value="-createdAt">Newest first</MenuItem>
          <MenuItem value="createdAt">Oldest first</MenuItem>
          <MenuItem value="title">Title A-Z</MenuItem>
          <MenuItem value="-title">Title Z-A</MenuItem>
        </Select>

        <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={handleExport}>
          Export CSV
        </Button>
      </section>

      <section className="content-surface">
        {loading ? (
          <LoadingState />
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts found"
            description="Create a new post or change the filters to see more results."
            action={
              <Button component={Link} to="/posts/new" variant="contained" startIcon={<AddCircleOutlineIcon />}>
                Add Post
              </Button>
            }
          />
        ) : (
          <>
            <TableContainer className="posts-table-wrap">
              <Table aria-label="Blog posts table">
                <TableHead>
                  <TableRow>
                    <TableCell>Post</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Updated</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post._id} hover>
                      <TableCell>
                        <div className="table-title-cell">
                          <span>{post.title}</span>
                          <small>{post.excerpt || `${post.readTime} min read`}</small>
                        </div>
                      </TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>
                        <StatusChip status={post.status} />
                      </TableCell>
                      <TableCell>{formatDate(post.updatedAt)}</TableCell>
                      <TableCell align="right">
                        <div className="table-actions">
                          <Tooltip title="View post">
                            <IconButton aria-label={`View ${post.title}`} onClick={() => navigate(`/posts/${post._id}`)}>
                              <VisibilityOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit post">
                            <IconButton aria-label={`Edit ${post.title}`} onClick={() => navigate(`/posts/${post._id}/edit`)}>
                              <EditOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete post">
                            <IconButton
                              aria-label={`Delete ${post.title}`}
                              color="error"
                              onClick={() => setDeletingPost(post)}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="mobile-post-list">
              {posts.map((post) => (
                <article className="mobile-post-card" key={post._id}>
                  <div className="mobile-card-topline">
                    <span>{post.category}</span>
                    <StatusChip status={post.status} />
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt || `${post.readTime} min read`}</p>
                  <div className="mobile-card-meta">
                    <span>{post.author}</span>
                    <span>{formatDate(post.updatedAt)}</span>
                  </div>
                  <div className="mobile-card-actions">
                    <Button component={Link} to={`/posts/${post._id}`} size="small" startIcon={<VisibilityOutlinedIcon />}>
                      View
                    </Button>
                    <Button component={Link} to={`/posts/${post._id}/edit`} size="small" startIcon={<EditOutlinedIcon />}>
                      Edit
                    </Button>
                    <Button color="error" size="small" startIcon={<DeleteOutlineIcon />} onClick={() => setDeletingPost(post)}>
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            <TablePagination
              component="div"
              count={pagination.total}
              page={page}
              rowsPerPage={limit}
              onPageChange={(_event, nextPage) => setPage(nextPage)}
              onRowsPerPageChange={(event) => {
                setLimit(Number.parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deletingPost)}
        title="Delete post"
        description={`This will permanently delete "${deletingPost?.title || "this post"}".`}
        confirmLabel="Delete"
        onClose={() => setDeletingPost(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
};
