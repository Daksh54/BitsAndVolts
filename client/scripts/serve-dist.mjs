import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(dirname, "../dist");
const port = Number.parseInt(process.env.PORT || "4173", 10);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const resolveFile = async (urlPath) => {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = path.normalize(cleanPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(distDir, requestedPath === "/" ? "index.html" : requestedPath);

  if (!filePath.startsWith(distDir)) {
    return path.join(distDir, "index.html");
  }

  if (existsSync(filePath) && (await stat(filePath)).isFile()) {
    return filePath;
  }

  return path.join(distDir, "index.html");
};

const server = createServer(async (request, response) => {
  try {
    const filePath = await resolveFile(request.url || "/");
    const extension = path.extname(filePath);
    response.setHeader("Content-Type", contentTypes[extension] || "application/octet-stream");
    createReadStream(filePath).pipe(response);
  } catch {
    response.statusCode = 500;
    response.end("Unable to serve the application.");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Static client server running at http://localhost:${port}`);
});
