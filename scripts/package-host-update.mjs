import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { prepareHostRoutes } from "./prepare-host-routes.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const release = join(root, "release");
const stage = join(release, "host-update");
const archive = join(release, "anv-host-update.zip");
// Only application files are allowed. Host-managed news, uploads, admin files,
// databases and server configuration must never enter an overlay update.
const allowed = ["index.html", "assets", "locales", "forum-workshop"];
prepareHostRoutes(dist);
for (const name of allowed) {
  if (!existsSync(join(dist, name))) throw new Error(`Build output missing: ${name}. Run the build first.`);
}
mkdirSync(release, { recursive: true });
rmSync(stage, { recursive: true, force: true });
mkdirSync(stage);
for (const name of allowed) cpSync(join(dist, name), join(stage, name), { recursive: true });
if (existsSync(archive)) rmSync(archive);
const result = spawnSync("zip", ["-q", "-r", archive, ...allowed], { cwd: stage, stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(`zip exited with status ${result.status}`);
const walk = (dir, prefix = "") => readdirSync(dir).flatMap((name) => {
  const relative = prefix + name;
  return statSync(join(dir, name)).isDirectory() ? walk(join(dir, name), relative + "/") : [relative];
});
const manifest = walk(stage).sort();
if (manifest.some((name) => !allowed.includes(name.split("/")[0]))) throw new Error("Unexpected content in host update");
writeFileSync(join(release, "host-update-manifest.json"), JSON.stringify({ files: manifest }, null, 2) + "\n");
cpSync(join(root, "DEPLOYMENT.md"), join(release, "CITESTE-INAINTE-DE-UPLOAD.md"));
const news = JSON.parse(readFileSync(join(dist, "data/news.json"), "utf8"));
console.log(`Update ready: ${archive}\n${manifest.length} application files; host content excluded.\nFull local build: ${dist} (${Object.keys(news).length} news entries).`);
