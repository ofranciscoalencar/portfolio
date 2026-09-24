import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { IPBrowser } from "@/components/IPBrowser";
import { getEntertainmentCopy } from "@/content/entertainment";
import { ENTERTAINMENT_INTRO_VIDEO, ips } from "@/data/entertainment";
import { resolveLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Entertainment",
  description:
    "Original slate by Francisco Alencar. Feature, series, documentary, and podcast projects in development for streaming. Brazilian voice, international scope. Includes The Delivery, The Clinic, Fork in the Road, and BOLO Podcast.",
};

export default async function EntertainmentPage(
  props: PageProps<"/entertainment">
) {
  const { lang: langRaw } = await props.searchParams;
  const lang = resolveLang(langRaw);
  const copy = getEntertainmentCopy(lang);

  return (
    <PageShell lang={lang} showFooter={false}>
      <IPBrowser
        ips={ips}
        lang={lang}
        copy={copy}
        introVideo={ENTERTAINMENT_INTRO_VIDEO}
      />
    </PageShell>
  );
}
