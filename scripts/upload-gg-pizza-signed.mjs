/**
 * Upload compressed JPEGs using pre-signed batches (run sign-upload via Cloudinary MCP first).
 * Usage: node scripts/upload-gg-pizza-signed.mjs scripts/.gg-pizza-signatures.json
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const TMP = path.join(ROOT, "..", ".tmp-gg-pizza-hosp");
const credsFile = process.argv[2];
if (!credsFile) {
  console.error("missing credentials json");
  process.exit(1);
}
const creds = JSON.parse(fs.readFileSync(credsFile, "utf8"));

for (let i = 0; i < creds.length; i++) {
  const n = String(i + 1).padStart(2, "0");
  const file = path.join(TMP, `gg-pizza-${n}.jpg`);
  const {
    upload_params,
    api_key,
    signature,
    host,
    cloud_name,
  } = creds[i];
  const url = `https://${host}/v1_1/${cloud_name}/image/upload`;
  const form = new FormData();
  form.append("file", new Blob([fs.readFileSync(file)]), `gg-pizza-${n}.jpg`);
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
  console.log("OK", json.width + "x" + json.height);
}
console.log("done");
