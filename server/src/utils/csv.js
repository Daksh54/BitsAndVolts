const csvEscape = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const text = Array.isArray(value) ? value.join(", ") : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

export const postsToCsv = (posts) => {
  const headers = [
    "Title",
    "Author",
    "Category",
    "Status",
    "Excerpt",
    "Tags",
    "Read Time",
    "Created At",
    "Updated At"
  ];

  const rows = posts.map((post) => [
    post.title,
    post.author,
    post.category,
    post.status,
    post.excerpt,
    post.tags,
    `${post.readTime} min`,
    post.createdAt?.toISOString(),
    post.updatedAt?.toISOString()
  ]);

  return [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
};
