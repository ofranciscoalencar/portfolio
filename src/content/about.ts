import type { Lang } from "@/lib/i18n";

export type AboutCopy = {
  bio: string[];
  credits: string;
  stats: Array<{ value: string; label: string }>;
  awards: { heading: string; items: Array<{ year: string; name: string }> };
};

const CREDITS =
  "GOOGLE · YOUTUBE · WAZE · TIKTOK · MOTOROLA · MERCADO LIVRE · NETFLIX · CAZÉTV · NUBANK";

const dict: Record<Lang, AboutCopy> = {
  en: {
    bio: [
      "I grew up between São Paulo's concrete and the stories that escaped it: movies, hip-hop, pirated videogames, late-night TV, sports and the sense that Brazilian stories deserved bigger screens. That instinct took me to the New York Film Academy, where I trained as a screenwriter, and then to Google, where I worked on stories people choose to watch.",
      "Over 18 years I've led creative for Google, YouTube, TikTok, Waze, Motorola, and Mercado Livre. Films watched over 140 million times. The award-winning YouTube global Pride campaign with Kobe Bryant and Neymar. Putting the Rio favelas on Google Maps. Making the most-watched Google ad in Brazil. Launching the YouTube brand that reshaped the Latin American market and helped build the Creator Economy. Every project started with the same question: how do you make something for a brand that culture actually wants?",
      "I've done a bit of everything. From creating a brand with Konrad Dantas (Kondzilla) to naming and branding Nubank Croma, Nubank's new customer segment, with KOTO NYC.",
      "Today I create brands as a Creative Strategist, write original stories for streaming, and make branded content that connects with people's emotions. I work AI-native, with Claude and a stack of custom tools, and I run my practice from São Paulo for clients anywhere.",
    ],
    credits: CREDITS,
    stats: [
      { value: "18+", label: "YEARS" },
      { value: "20+", label: "FILMS" },
      { value: "140M+", label: "VIEWS" },
      { value: "20+", label: "BRANDS" },
    ],
    awards: {
      heading: "Awards & Recognition",
      items: [
        { year: "2023", name: "MMA Smarties LATAM" },
        { year: "2015", name: "D&AD Awards" },
        { year: "2015", name: "New York Festivals Award" },
        { year: "2015", name: "Webby Awards" },
        { year: "2015", name: "Shorty Awards · Best Film" },
        { year: "2015", name: "Ciclope Awards · Best Film" },
        { year: "2015", name: "Wave Festival · Meio & Mensagem" },
        { year: "2014", name: "Google Platinum Award" },
        { year: "2013", name: "Cannes Young Lions" },
      ],
    },
  },
  pt: {
    bio: [
      "Cresci entre o concreto de São Paulo e as histórias que escapavam dele: filmes, hip-hop, videogames piratas, TV de madrugada, esporte e a convicção de que histórias brasileiras mereciam telas maiores. Esse instinto me levou à New York Film Academy, onde me formei em roteiro, e depois ao Google, onde trabalhei em histórias que as pessoas escolhem assistir.",
      "Em 18 anos, liderei criação para Google, YouTube, TikTok, Waze, Motorola e Mercado Livre. Filmes assistidos mais de 140 milhões de vezes. A campanha global de Pride do YouTube com Kobe Bryant e Neymar, premiada mundialmente. Colocando as favelas do Rio no Google Maps. Fazendo o anúncio mais visto do Google no Brasil. Lançando a marca do YouTube que reconfigurou o mercado latino-americano e ajudou a construir a Creator Economy. Todo projeto começou com a mesma pergunta: como fazer algo para uma marca que a cultura realmente queira assistir?",
      "Já fiz um pouco de tudo. De criar uma marca com Konrad Dantas (Kondzilla) a criar o naming e a marca do Nubank Croma, novo segmento de clientes do Nubank, em parceria com a KOTO NYC.",
      "Hoje crio marcas como Creative Strategist, escrevo histórias originais para streaming e produzo branded content que conversa com as emoções das pessoas. Trabalho AI-native, com Claude e um stack de ferramentas próprias, e toco minha prática de São Paulo para clientes em qualquer lugar.",
    ],
    credits: CREDITS,
    stats: [
      { value: "18+", label: "ANOS" },
      { value: "20+", label: "FILMES" },
      { value: "140M+", label: "VIEWS" },
      { value: "20+", label: "MARCAS" },
    ],
    awards: {
      heading: "Prêmios & Reconhecimento",
      items: [
        { year: "2023", name: "MMA Smarties LATAM" },
        { year: "2015", name: "D&AD Awards" },
        { year: "2015", name: "New York Festivals Award" },
        { year: "2015", name: "Webby Awards" },
        { year: "2015", name: "Shorty Awards · Best Film" },
        { year: "2015", name: "Ciclope Awards · Best Film" },
        { year: "2015", name: "Wave Festival · Meio & Mensagem" },
        { year: "2014", name: "Google Platinum Award" },
        { year: "2013", name: "Cannes Young Lions" },
      ],
    },
  },
};

export function getAboutCopy(lang: Lang): AboutCopy {
  return dict[lang];
}
