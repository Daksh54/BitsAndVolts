import type { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import { Button } from "@mui/material";

export const AppShell = ({ children }: PropsWithChildren) => (
  <div className="app-shell">
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark">
          <ArticleOutlinedIcon fontSize="small" />
        </span>
        <span>
          <span className="brand-title">Bits Blog</span>
          <span className="brand-subtitle">Post Management</span>
        </span>
      </Link>

      <nav className="topbar-actions" aria-label="Primary navigation">
        <Button
          component={NavLink}
          to="/"
          variant="text"
          color="inherit"
          startIcon={<TableRowsOutlinedIcon />}
        >
          Posts
        </Button>
        <Button
          component={NavLink}
          to="/posts/new"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
        >
          New Post
        </Button>
      </nav>
    </header>

    <main className="page-shell">{children}</main>
  </div>
);
