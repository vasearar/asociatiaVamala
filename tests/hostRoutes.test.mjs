import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { prepareHostRoutes } from "../scripts/prepare-host-routes.mjs";

test("direct legacy URLs get the app entry without overwriting event resources or host config", () => {
  const dist = mkdtempSync(join(tmpdir(), "anv-host-routes-"));
  try {
    const original = '<html><script type="module" src="/assets/app.js"></script><div id="root"></div></html>';
    writeFileSync(join(dist, "index.html"), original);
    mkdirSync(join(dist, "forum-workshop/agendas"), { recursive: true });
    writeFileSync(join(dist, "forum-workshop/agendas/forum.pdf"), "%PDF-existing-agenda");
    writeFileSync(join(dist, ".htaccess"), "existing hosting configuration");
    prepareHostRoutes(dist);
    assert.equal(readFileSync(join(dist, "forum-workshop/index.html"), "utf8"), original);
    assert.equal(readFileSync(join(dist, "forum-workshop/agendas/forum.pdf"), "utf8"), "%PDF-existing-agenda");
    assert.equal(readFileSync(join(dist, ".htaccess"), "utf8"), "existing hosting configuration");
    const updated = original.replace("app.js", "updated.js");
    writeFileSync(join(dist, "index.html"), updated);
    prepareHostRoutes(dist);
    assert.equal(readFileSync(join(dist, "forum-workshop/index.html"), "utf8"), updated);
  } finally {
    rmSync(dist, { recursive: true, force: true });
  }
});

test("route preparation fails if the build entry is missing", () => {
  const dist = mkdtempSync(join(tmpdir(), "anv-host-routes-empty-"));
  try {
    assert.throws(() => prepareHostRoutes(dist), /Missing dist\/index.html/);
  } finally {
    rmSync(dist, { recursive: true, force: true });
  }
});
