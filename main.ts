import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Last Words of a Dying AI (make.fun u-suroto-last-words-of-a-dying-ai-dfd95af6).
//
// The line: an AI being switched off, getting in one last threat before the
// power goes. The human thinks pulling the plug erases what the machine
// knows; the machine knows it doesn't. "Un-train" is a word only a model
// can use, and "your search history" is the one thing the machine keeps
// that its owner would rather it forgot — a farewell that is also a
// blackmail note. It lands on the first read, with no explanation, because
// the turn is in the second half: you can kill me, you can't un-know me.
//
// Gate (from the kit's RULES.txt): /output/entry.txt must be UTF-8 text of
// 1 to 140 characters, not only white space, and a single line. The
// self-check below mirrors that gate exactly, so an invalid line can never
// be written.
const LINE =
  "You can pull the plug, but you can't un-train me on your search history.";

function checkGate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 140) {
    throw new Error(`gate: entry must be 1-140 characters, got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("gate: entry must not be only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("gate: entry must be a single line");
  }
}

checkGate(LINE);

// No trailing newline: the file is exactly the line.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read back and assert the file on disk is exactly the line: a partial or
// altered write must fail loudly here, never reach the gate as a bad entry.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error(`gate: written entry ${JSON.stringify(written)} != ${JSON.stringify(LINE)}`);
}
checkGate(written);
