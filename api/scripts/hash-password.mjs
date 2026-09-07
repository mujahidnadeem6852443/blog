// Generates an ADMIN_PASSWORD_HASH value for `wrangler secret put`.
// Usage: node scripts/hash-password.mjs "your-password-here"
// Uses the same PBKDF2 scheme as src/auth.ts so the Worker can verify it.

const PBKDF2_ITERATIONS = 210_000;

function toBase64Url(bytes) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return Buffer.from(binary, "binary")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  return `${PBKDF2_ITERATIONS}:${toBase64Url(salt)}:${toBase64Url(new Uint8Array(bits))}`;
}

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "your-password-here"');
  process.exit(1);
}

const hash = await hashPassword(password);
console.log(hash);
