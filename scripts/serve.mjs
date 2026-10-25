import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve("out");
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ico": "image/x-icon",
};
await stat(resolve(root, "index.html")).catch(() => {
  throw new Error("Run npm run build before npm start.");
});
const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://127.0.0.1").pathname,
    );
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      response.writeHead(403);
      response.end();
      return;
    }
    const info = await stat(file).catch(() => null);
    if (info?.isDirectory()) file = resolve(file, "index.html");
    else if (!info && !extname(file)) file = resolve(file, "index.html");
    let status = 200;
    const body = await readFile(file).catch(async () => {
      status = 404;
      return readFile(resolve(root, "404.html"));
    });
    response.writeHead(status, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`PlexonQoL static preview: http://127.0.0.1:${port}`),
);
