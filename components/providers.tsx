"use client";

import { shouldLoadSession } from "@/lib/session-routes";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (!shouldLoadSession(pathname)) {
    return children;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
