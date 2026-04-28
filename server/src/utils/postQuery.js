const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildPostQuery = (queryParams) => {
  const query = {};
  const searchTerm = queryParams.search || queryParams.query;

  if (searchTerm) {
    const regex = new RegExp(escapeRegex(searchTerm.trim()), "i");
    query.$or = [{ title: regex }, { author: regex }, { category: regex }];
  }

  if (queryParams.category) {
    query.category = new RegExp(`^${escapeRegex(queryParams.category.trim())}$`, "i");
  }

  if (queryParams.author) {
    query.author = new RegExp(escapeRegex(queryParams.author.trim()), "i");
  }

  if (queryParams.status) {
    query.status = queryParams.status;
  }

  return query;
};

export const getPagination = (queryParams) => {
  const page = Math.max(Number.parseInt(queryParams.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(queryParams.limit, 10) || 10, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const getSort = (sortValue) => {
  const allowedSorts = new Set([
    "createdAt",
    "-createdAt",
    "title",
    "-title",
    "author",
    "-author",
    "category",
    "-category",
    "status",
    "-status"
  ]);

  return allowedSorts.has(sortValue) ? sortValue : "-createdAt";
};
