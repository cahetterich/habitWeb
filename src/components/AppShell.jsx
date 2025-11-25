"use client";

import { usePathname } from "next/navigation";
import NavbarPublic from "@/components/NavbarPublic";
import Footer from "@/components/Footer";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAppRoute = pathname.startsWith("/app");

  return (
    <>
      {/* Rotas públicas: navbar + footer públicos */}
      {!isAppRoute && <NavbarPublic />}

      <main>{children}</main>

      {!isAppRoute && <Footer />}
    </>
  );
}
