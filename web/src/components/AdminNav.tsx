"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    await fetch(`${API_URL}/api/logout`, { method: "POST", credentials: "include" });
    router.replace("/admin/login");
  }

  return (
    <div className="row" style={{ justifyContent: "space-between", marginBottom: 24 }}>
      <div className="row">
        <Link href="/admin" className="chip">
          Posts
        </Link>
        <Link href="/admin/content" className="chip">
          Site Content
        </Link>
      </div>
      <button className="btn btn-secondary" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}
