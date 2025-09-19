#!/usr/bin/env bun
import { existsSync } from "fs";
import { join } from "path";

const isDev = process.argv.includes("--dev");
const port = isDev ? 3001 : 4173;

const server = Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    let filePath = url.pathname === "/" ? "index.html" : url.pathname;

    // Remove leading slash for file system
    if (filePath.startsWith("/")) filePath = filePath.slice(1);

    const fullPath = join("dist", filePath);

    // Serve file if it exists
    if (existsSync(fullPath)) {
      return new Response(Bun.file(fullPath));
    }

    // SPA fallback - serve index.html for non-asset requests
    if (!filePath.includes(".") && !filePath.startsWith("assets/")) {
      const indexPath = join("dist", "index.html");
      if (existsSync(indexPath)) {
        return new Response(Bun.file(indexPath), {
          headers: { "Content-Type": "text/html" },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(
  `${isDev ? "🚀 Dev" : "📦 Preview"} server running at http://localhost:${port}`,
);
