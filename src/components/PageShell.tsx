import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import type { Lang } from "@/lib/i18n";

export function PageShell({
  lang,
  children,
  showFooter = true,
}: {
  lang: Lang;
  children: ReactNode;
  showFooter?: boolean;
}) {
  return (
    <>
      <Nav lang={lang} />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer lang={lang} />}
    </>
  );
}
