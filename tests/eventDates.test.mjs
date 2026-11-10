import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/utils/eventDates.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { hasEventDatePassed } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("an unpublished agenda has no past-event label", () => {
  assert.equal(hasEventDatePassed(undefined, new Date("2030-01-01T00:00:00Z")), false);
});
test("an upcoming event is not marked as past", () => {
  assert.equal(hasEventDatePassed("2026-11-17", new Date("2026-11-10T12:00:00Z")), false);
});
test("the label stays hidden throughout the event day, including the evening reception", () => {
  assert.equal(hasEventDatePassed("2026-11-17", new Date("2026-11-17T21:59:59.999Z")), false);
});
test("the label appears exactly at midnight in Chișinău", () => {
  assert.equal(hasEventDatePassed("2026-11-17", new Date("2026-11-17T22:00:00Z")), true);
});
test("each agenda has its own date", () => {
  const now = new Date("2026-11-18T12:00:00Z");
  assert.equal(hasEventDatePassed("2026-11-17", now), true);
  assert.equal(hasEventDatePassed("2026-11-18", now), false);
});
test("both agendas are marked as past after the second day", () => {
  const now = new Date("2026-11-18T22:00:00Z");
  assert.equal(hasEventDatePassed("2026-11-17", now), true);
  assert.equal(hasEventDatePassed("2026-11-18", now), true);
});
test("the event timezone follows summer time too", () => {
  assert.equal(hasEventDatePassed("2027-07-01", new Date("2027-07-01T20:59:59.999Z")), false);
  assert.equal(hasEventDatePassed("2027-07-01", new Date("2027-07-01T21:00:00Z")), true);
});
