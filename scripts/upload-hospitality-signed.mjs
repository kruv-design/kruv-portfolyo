/**
 * node scripts/upload-hospitality-signed.mjs <creds.json> <tmpDir> <prefix>
 * prefix example: gallery | gg-pizza
 */
import fs from "node:fs";
import path from "node:path";

const credsFile = process.argv[2];
const tmpDir = process.argv[3];
const prefix = process.argv[4] ?? "gallery";
if (!credsFile || !tmpDir) {
  console.error("usage: upload-hospitality-signed.mjs creds.json tmpDir [prefix]");
  process.exit(1);
}
const creds = JSON.parse(fs.readFileSync(credsFile, "utf8"));

for (let i = 0; i < creds.length; i++) {
  const n = String(i + 1).padStart(2, "0");
  const file = path.join(tmpDir, `${prefix}-${n}.jpg`);
  if (!fs.existsSync(file)) {
    console.error("missing", file);
    process.exit(1);
  }
  const { upload_params, api_key, signature, host, cloud_name } = creds[i];
  const url = `https://${host}/v1_1/${cloud_name}/image/upload`;
  const form = new FormData();
  form.append("file", new Blob([fs.readFileSync(file)]), `${prefix}-${n}.jpg`);
  form.append("api_key", api_key);
  form.append("signature", signature);
  for (const [k, v] of Object.entries(upload_params)) {
    form.append(k, String(v));
  }
  process.stdout.write(`${upload_params.public_id} … `);
  const res = await fetch(url, { method: "POST", body: form });
  const json = await res.json();
  if (!res.ok) {
    console.error("FAIL", json);
    process.exit(1);
  }
  console.log("OK");
}
console.log("done");
