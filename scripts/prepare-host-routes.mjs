import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function prepareHostRoutes(dist) {
  const entry = join(dist, "index.html");
  if (!existsSync(entry)) throw new Error("Missing dist/index.html. Build the application first.");
  // The old page URL is also a real asset directory. Apache/nginx serves that
  // directory before the SPA fallback, so it needs its own copy of the app entry.
  // The app then redirects to /forum&workshop, preserving query and hash.
  const legacyDirectory = join(dist, "forum-workshop");
  mkdirSync(legacyDirectory, { recursive: true });
  cpSync(entry, join(legacyDirectory, "index.html"));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  prepareHostRoutes(join(root, "dist"));
  console.log("Direct-link entry prepared for /forum-workshop; canonical page: /forum&workshop.");
}
