// No domain has been chosen yet (see Requirements Section 18).
// Set NEXT_PUBLIC_SITE_URL once one is picked; this fallback only matters for local dev.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
