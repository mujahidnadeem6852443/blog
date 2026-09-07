"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

// Client-side redirect only — this is a UX convenience, not the real access
// control. The backend enforces auth on every /api/admin/* request regardless.
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecked(true);
      return;
    }

    setChecked(false);
    let cancelled = false;
    fetch(`${API_URL}/api/session`, { credentials: "include" })
      .then((res) => res.json())
      .then((data: { authenticated: boolean }) => {
        if (cancelled) return;
        if (!data.authenticated) {
          router.replace("/admin/login");
        } else {
          setChecked(true);
        }
      })
      .catch(() => {
        if (!cancelled) router.replace("/admin/login");
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!checked) return <p>Checking session…</p>;
  return <>{children}</>;
}
