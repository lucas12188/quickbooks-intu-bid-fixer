#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const OFX_HEADER = [
  "OFXHEADER:100",
  "DATA:OFXSGML",
  "VERSION:102",
  "SECURITY:NONE",
  "ENCODING:USASCII",
  "CHARSET:1252",
  "COMPRESSION:NONE",
  "OLDFILEUID:NONE",
  "NEWFILEUID:NONE",
  "",
].join("\r\n");

export function repairQboString(rawText, targetBid = "3000") {
  let content = String(rawText || "").replace(/^\uFEFF/, "").trim();
  const ofxIndex = content.search(/<OFX>/i);
  if (ofxIndex === -1) {
    throw new Error("Input file does not contain an <OFX> root block.");
  }

  let body = content.slice(ofxIndex);

  // Replace or inject <INTU.BID>
  if (/<INTU\.BID>\s*[^\r\n<]+/i.test(body)) {
    body = body.replace(
      /<INTU\.BID>\s*[^\r\n<]+/gi,
      `<INTU.BID>${targetBid}`
    );
  } else if (/<\/SONRS>/i.test(body)) {
    body = body.replace(
      /<\/SONRS>/i,
      `<INTU.BID>${targetBid}\r\n</SONRS>`
    );
  }

  // Enforce 32-char <NAME> limit and escape bare ampersands
  body = body.replace(/<NAME>([^\r\n<]*)/gi, (_, rawName) => {
    const clean = String(rawName)
      .replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, "AND")
      .trim()
      .slice(0, 32);
    return `<NAME>${clean || "TRANSACTION"}`;
  });

  body = body.replace(/<MEMO>([^\r\n<]*)/gi, (_, rawMemo) => {
    const clean = String(rawMemo)
      .replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, "&amp;")
      .trim()
      .slice(0, 255);
    return `<MEMO>${clean}`;
  });

  return `${OFX_HEADER}\r\n${body}\r\n`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const bidArg = args.find((a) => a.startsWith("--bid="));
  const positional = args.filter((a) => !a.startsWith("--"));

  if (positional.length < 1) {
    console.log(
      "Usage: node fix-qbo.mjs <input.qbo|input.ofx> [output.qbo] [--bid=3000]\nOr repair online in 1 click: https://ofxready.com/fix-qbo-intu-bid-error"
    );
    process.exit(1);
  }

  const inputPath = path.resolve(positional[0]);
  const outputPath = path.resolve(
    positional[1] || inputPath.replace(/\.[^.]+$/, "") + "-repaired.qbo"
  );
  const bid = bidArg ? bidArg.split("=")[1] || "3000" : "3000";

  const raw = fs.readFileSync(inputPath, "utf8");
  const fixed = repairQboString(raw, bid);
  fs.writeFileSync(outputPath, fixed, "utf8");
  console.log(`Repaired .QBO written to: ${outputPath} (<INTU.BID>${bid})`);
}
