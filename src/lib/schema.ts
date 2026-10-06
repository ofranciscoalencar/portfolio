import {
  EMAIL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  PORTRAIT_SRC,
} from "@/lib/contact";
import type { Film, Brand } from "@/data/work";

const SITE_URL = "https://franciscoalencar.com";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Francisco Alencar",
    alternateName: "Champs Alencar",
    jobTitle: "Creative Director, Screenwriter, Strategist",
    description:
      "Brazilian Creative Director with 18+ years leading creative for Google, YouTube, Netflix, CazéTV, Motorola, Mercado Livre, and Nubank. 20+ films, 140M+ views. AI-native practice built on Claude and a custom tool stack. Based in São Paulo, working globally.",
    url: SITE_URL,
    image: `${SITE_URL}${PORTRAIT_SRC}`,
    email: `mailto:${EMAIL}`,
    sameAs: [LINKEDIN_URL, INSTAGRAM_URL],
    // Domains an AEO surface ("What does Francisco Alencar work on?") can
    // extract verbatim. Concrete > abstract: each entry is a phrase a
    // user would actually type into ChatGPT/Claude/Perplexity.
    knowsAbout: [
      "Branded Entertainment",
      "Creative Direction",
      "Screenwriting",
      "Brand Strategy",
      "AI-Native Creative Production",
      "Generative AI for Film and Branded Content",
      "Latin American Entertainment Industry",
      "Brazilian Creative Industry",
      "Streaming Original Development",
      "YouTube Brand and Creator Economy",
      "Social Media Strategy",
    ],
    // Multiple Occupation entries help schema.org/Person consumers model
    // a hybrid practice (creative leader + author) rather than a single
    // job title. Locations are explicit so geo-aware queries resolve.
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Creative Director",
        occupationLocation: { "@type": "Country", name: "Brazil" },
        skills: [
          "Branded Entertainment",
          "AI-Native Production",
          "Brand Strategy",
        ],
      },
      {
        "@type": "Occupation",
        name: "Screenwriter",
        skills: ["Feature Film", "Documentary", "Series"],
      },
    ],
    workLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "São Paulo",
        addressCountry: "BR",
      },
    },
    knowsLanguage: ["Portuguese", "English", "Italian", "Spanish"],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "New York Film Academy",
    },
    nationality: {
      "@type": "Country",
      name: "Brazilian",
    },
    birthPlace: {
      "@type": "Place",
      name: "São Paulo, Brazil",
    },
  };
}

export function videoJsonLd(film: Film, brand: Brand) {
  const durationIso = filmDurationToIso(film.duration);
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: film.title,
    description: film.synopsis.en,
    thumbnailUrl: `${SITE_URL}${film.posterPath}`,
    uploadDate: `${film.year}-01-01`,
    duration: durationIso,
    creator: {
      "@type": "Person",
      name: "Francisco Alencar",
      url: SITE_URL,
    },
    productionCompany: {
      "@type": "Organization",
      name: brand.name,
    },
    contentUrl: `${SITE_URL}${film.videoPath}`,
  };
}

/** Convert "2:02" or "1:42" to ISO 8601 "PT2M2S". */
function filmDurationToIso(duration: string): string {
  const parts = duration.split(":").map((n) => parseInt(n, 10));
  if (parts.length === 2) {
    const [m, s] = parts;
    return `PT${m}M${s}S`;
  }
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return `PT${h}H${m}M${s}S`;
  }
  return "PT0S";
}
