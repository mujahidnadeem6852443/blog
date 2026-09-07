import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mujahid Nadeem",
    template: "%s | Mujahid Nadeem",
  },
  description: "Personal website and blog of Mujahid Nadeem, Data & Cloud Engineer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body>
        <header className="site-header">
          <div className="container">
            <NavBar />
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container row" style={{ justifyContent: "space-between" }}>
            <span>&copy; {new Date().getFullYear()} Mujahid Nadeem</span>
            <span className="muted">Built with Next.js &amp; Cloudflare</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
