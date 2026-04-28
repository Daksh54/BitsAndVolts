import mongoose from "mongoose";

export const notFound = (request, _response, next) => {
  const error = new Error(`Route not found: ${request.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _request, response, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong.";

  if (error instanceof mongoose.Error.CastError) {
    statusCode = 404;
    message = "Post not found.";
  }

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(" ");
  }

  if (error?.code === 11000) {
    statusCode = 409;
    message = "A post with these unique details already exists.";
  }

  response.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
};
