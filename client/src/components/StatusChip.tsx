import { Chip } from "@mui/material";
import type { PostStatus } from "../types/post";

interface StatusChipProps {
  status: PostStatus;
}

const statusClassNames: Record<PostStatus, string> = {
  Draft: "status-chip status-draft",
  Published: "status-chip status-published",
  Archived: "status-chip status-archived"
};

export const StatusChip = ({ status }: StatusChipProps) => (
  <Chip className={statusClassNames[status]} label={status} size="small" />
);
