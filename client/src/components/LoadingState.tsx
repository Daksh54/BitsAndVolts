import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { CircularProgress } from "@mui/material";
import type { ReactNode } from "react";

interface LoadingStateProps {
  label?: string;
}

export const LoadingState = ({ label = "Loading posts" }: LoadingStateProps) => (
  <div className="state-panel">
    <CircularProgress size={30} />
    <span>{label}</span>
  </div>
);

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="state-panel state-panel-empty">
    <span className="empty-icon">
      <ArticleOutlinedIcon />
    </span>
    <h2>{title}</h2>
    <p>{description}</p>
    {action}
  </div>
);
