// No production API URL exists yet — set NEXT_PUBLIC_API_URL once the Worker
// has a permanent domain. This fallback is for local dev only.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";
