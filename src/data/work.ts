/**
 * work.ts — Source of truth for all films × brands.
 * Current state: 17 released films + 2 coming soon, across 9 brands.
 *
 * History: Netflix + CazéTV + Nubank added as brands 2026-04-23;
 * PLAYTAGS, THESCIENCEBOX and Google Photos + Android removed.
 */

export type Film = {
  id: number
  slug: string
  title: string
  tagline: {
    en: string
    pt: string
  }
  synopsis: {
    en: string
    pt: string
  }
  brand: BrandSlug
  client: string
  role: string
  year: number
  duration: string
  views?: string
  likes?: string
  // Award credits (e.g. "D&AD · Webby · Shorty Best Film"). Optional.
  // Rendered in the FilmBrowser metadata grid when present, taking the
  // slot previously held by DURATION.
  awards?: string
  // Business / press / cultural outcomes (e.g. "Featured in Adweek;
  // 64.8K likes in 24h"). Optional, same slot as awards/views.
  results?: string
  // Announced but not yet released. FilmBrowser renders no video, hides
  // role/year, and the film is left out of counts and VideoObject JSON-LD.
  comingSoon?: boolean
  videoPath: string        // /videos/originals/{slug}.mp4
  editPath: string         // /videos/edits-15s/{slug}.mp4
  posterPath: string       // /art/{slug}.webp (TBD — Stage 3)
  featured: boolean        // appears in sizzle reel
  heroShot?: string        // shot # in sizzle timeline if featured
  order: number            // display order within brand
}

export type BrandSlug =
  | 'google'
  | 'youtube'
  | 'tiktok'
  | 'waze'
  | 'mercado-livre'
  | 'motorola'
  | 'netflix'
  | 'cazetv'
  | 'nubank'

export type Brand = {
  slug: BrandSlug
  name: string
  tagline: {
    en: string
    pt: string
  }
  filmCount: number
  order: number
}

// ─── BRANDS (display order) ──────────────────────────────

export const brands: Brand[] = [
  {
    slug: 'google',
    name: 'Google',
    tagline: {
      en: 'From moonshots to search. Shaping how Brazil connects, plays, and discovers.',
      pt: 'De moonshots a buscas. Moldando como o Brasil conecta, joga e descobre.',
    },
    filmCount: 7,
    order: 1,
  },
  {
    slug: 'youtube',
    name: 'YouTube',
    tagline: {
      en: 'Pride, talent, beauty. Every campaign a new format for the platform.',
      pt: 'Orgulho, talento, beleza. Cada campanha um novo formato para a plataforma.',
    },
    filmCount: 3,
    order: 2,
  },
  {
    slug: 'cazetv',
    name: 'CazéTV',
    tagline: {
      en: 'Creative leadership for the FIFA World Cup 2026 content operation at Livemode.',
      pt: 'Liderança criativa da operação de conteúdo para a Copa do Mundo FIFA 2026 na Livemode.',
    },
    filmCount: 1,
    order: 4,
  },
  {
    slug: 'netflix',
    name: 'Netflix',
    tagline: {
      en: 'Creative strategy for LatAm launches. Stranger Things, Wednesday, Senna.',
      pt: 'Estratégia criativa para lançamentos na América Latina. Stranger Things, Wednesday, Senna.',
    },
    filmCount: 1,
    order: 6,
  },
  {
    slug: 'tiktok',
    name: 'TikTok',
    tagline: {
      en: "Amplifying Black voices during Brazil's most important month of cultural reckoning.",
      pt: 'Amplificando vozes negras durante o mês mais importante de consciência cultural do Brasil.',
    },
    filmCount: 1,
    order: 5,
  },
  {
    slug: 'nubank',
    name: 'Nubank',
    tagline: {
      en: 'Naming, narrative and brand strategy for Croma, created from zero with KOTO NYC.',
      pt: 'Naming, narrativa e estratégia de marca do Croma, criados do zero com a KOTO NYC.',
    },
    filmCount: 1,
    order: 3,
  },
  {
    slug: 'waze',
    name: 'Waze',
    tagline: {
      en: 'Making a global nav app sound like it was born in Brazil.',
      pt: 'Fazendo um app global de navegação soar como se tivesse nascido no Brasil.',
    },
    filmCount: 1,
    order: 7,
  },
  {
    slug: 'mercado-livre',
    name: 'Mercado Livre',
    tagline: {
      en: "When the pitch has no net, the brand delivers, literally.",
      pt: 'Quando o campinho não tem rede, a marca entrega, literalmente.',
    },
    filmCount: 1,
    order: 8,
  },
  {
    slug: 'motorola',
    name: 'Motorola',
    tagline: {
      en: '30 seconds, 15.5 million views. The most-watched tech ad in Brazil that year.',
      pt: '30 segundos, 15,5 milhões de visualizações. O anúncio de tech mais assistido do Brasil naquele ano.',
    },
    filmCount: 1,
    order: 9,
  },
]

// ─── FILMS (ordered by brand, then by display order within brand) ──

export const films: Film[] = [
  // ── GOOGLE (7 films) ──────────────────────────────────────

  {
    id: 20,
    slug: 'beyond-the-map',
    title: 'Beyond the Map',
    tagline: {
      en: "Putting Rio's invisible communities on the map.",
      pt: 'Colocando comunidades invisíveis do Rio no mapa.',
    },
    synopsis: {
      en: "Google Brazil putting the communities in Rio on the map for the first time ever with Google Street View. The film documents an interactive storytelling project that turned an invisible community into navigable streets, named alleys, and addresses anyone can search. A piece about visibility, dignity, and what a map is really for.",
      pt: 'O Google Brasil colocando as comunidades do Rio no mapa pela primeira vez com o Google Street View. O filme documenta um projeto de storytelling interativo que transformou uma comunidade invisível em ruas navegáveis, becos com nome e endereços que qualquer pessoa pode pesquisar. Uma peça sobre visibilidade, dignidade e o que um mapa serve de verdade.',
    },
    brand: 'google',
    client: 'Google Maps',
    role: 'Creative Lead',
    year: 2016,
    duration: '0:57',
    results: 'First time the Rio favelas were search-mapped on Google Maps.',
    views: '1.59M',
    videoPath: '/videos/originals/beyond-the-map.mp4',
    editPath: '/videos/edits-15s/beyond-the-map.mp4',
    posterPath: '/art/beyond-the-map.webp',
    featured: true,
    order: 1,
  },
  {
    id: 1,
    slug: 'google-search-mojo',
    title: 'Google Search Brazil Mojo',
    tagline: {
      en: 'The search that moves Brazil forward.',
      pt: 'A busca que move o Brasil.',
    },
    synopsis: {
      en: "A 30-second Google Search spot capturing the product's role in daily Brazilian life through rapid-fire, culturally specific search queries. Google as the starting point for every ambition.",
      pt: 'Um spot de 30 segundos do Google Search capturando o papel do produto no dia a dia brasileiro através de buscas rápidas e culturalmente específicas. Google como ponto de partida para toda ambição.',
    },
    brand: 'google',
    client: 'Google',
    role: 'Creative Lead',
    year: 2017,
    duration: '0:30',
    videoPath: '/videos/originals/google-search-mojo.mp4',
    editPath: '/videos/edits-15s/google-search-mojo.mp4',
    posterPath: '/art/google-search-mojo.webp',
    featured: true,
    heroShot: 'Shot 22',
    order: 2,
  },
  {
    id: 2,
    slug: 'google-photos-ios',
    title: 'Google Photos iOS',
    tagline: {
      en: "Every photo tells a story. Google Photos remembers them all.",
      pt: 'Toda foto conta uma história. O Google Fotos lembra de todas.',
    },
    synopsis: {
      en: "A 30-second product spot for Google Photos on iOS. Visual storytelling over feature demonstration, optimized for mobile-first viewing. Part of Google's shift toward emotional product marketing.",
      pt: 'Um spot de 30 segundos do Google Fotos para iOS. Narrativa visual sobre demonstração de features, otimizado para visualização mobile-first. Parte da virada do Google rumo ao marketing emocional de produto.',
    },
    brand: 'google',
    client: 'Google Photos',
    role: 'Creative Lead',
    year: 2017,
    duration: '0:30',
    videoPath: '/videos/originals/google-photos-ios.mp4',
    editPath: '/videos/edits-15s/google-photos-ios.mp4',
    posterPath: '/art/google-photos-ios.webp',
    featured: true,
    heroShot: 'Shot 10',
    order: 3,
  },
  {
    id: 3,
    slug: 'we-speak-translate',
    title: 'We Speak Translate: Reel',
    tagline: {
      en: 'Breaking language barriers through technology and human connection.',
      pt: 'Quebrando barreiras linguísticas com tecnologia e conexão humana.',
    },
    synopsis: {
      en: "Google Translate's brand campaign in Brazil. A utility product humanized by showing how it closes real communication gaps between real people.",
      pt: 'A campanha de marca do Google Tradutor no Brasil. Um produto utilitário humanizado ao mostrar como conecta pessoas reais através de barreiras linguísticas.',
    },
    brand: 'google',
    client: 'Google Translate',
    role: 'Creative Lead',
    year: 2017,
    duration: '2:29',
    views: '6.87M',
    videoPath: '/videos/originals/we-speak-translate.mp4',
    editPath: '/videos/edits-15s/we-speak-translate.mp4',
    posterPath: '/art/we-speak-translate.webp',
    featured: true,
    heroShot: 'Shot 09 (vermillion — red traffic light)',
    order: 4,
  },
  {
    id: 4,
    slug: 'project-loon',
    title: 'Project Loon: Brazil Test',
    tagline: {
      en: 'Bringing internet to the unreachable corners of Brazil.',
      pt: 'Levando internet aos cantos inalcançáveis do Brasil.',
    },
    synopsis: {
      en: "Google X's moonshot: high-altitude balloons delivering internet to remote Brazilian communities. A film at the intersection of frontier technology and social impact.",
      pt: 'O moonshot do Google X: balões de alta altitude levando internet para comunidades remotas brasileiras. Um filme na interseção entre tecnologia de fronteira e impacto social.',
    },
    brand: 'google',
    client: 'Google X (Alphabet)',
    role: 'Creative Lead',
    year: 2017,
    duration: '2:15',
    videoPath: '/videos/originals/project-loon.mp4',
    editPath: '/videos/edits-15s/project-loon.mp4',
    posterPath: '/art/project-loon.webp',
    featured: true,
    heroShot: 'Shot 24',
    order: 5,
  },
  {
    id: 6,
    slug: 'vote-agora',
    title: 'Vote Agora: Desafio de Impacto Social Google',
    tagline: {
      en: 'Your click has the power to change Brazil.',
      pt: 'Seu clique tem o poder de mudar o Brasil.',
    },
    synopsis: {
      en: "Google's Impact Challenge invited Brazilians to vote for the country's most transformative social initiatives. The film drove nationwide civic participation at scale. 3.1M views.",
      pt: 'O Desafio de Impacto Social do Google convidou brasileiros a votar nas iniciativas sociais mais transformadoras do país. O filme gerou participação cívica em escala nacional. 3,1M views.',
    },
    brand: 'google',
    client: 'Google',
    role: 'Creative Lead',
    year: 2014,
    duration: '1:20',
    views: '3.1M',
    videoPath: '/videos/originals/vote-agora.mp4',
    editPath: '/videos/edits-15s/vote-agora.mp4',
    posterPath: '/art/vote-agora.webp',
    featured: false,
    order: 6,
  },
  {
    id: 7,
    slug: 'joga-mais-1',
    title: 'Joga+1 powered by Google+',
    tagline: {
      en: 'Connecting people through the universal language of sport.',
      pt: 'Conectando pessoas pela linguagem universal do esporte.',
    },
    synopsis: {
      en: 'A Google+ campaign that matched solo athletes with pickup games across Brazil. A social platform turned into a real-world sports connector. 8.1M views.',
      pt: 'Uma campanha do Google+ que conectava atletas solo a jogos de rua pelo Brasil. Uma plataforma social virando conector esportivo no mundo real. 8,1M views.',
    },
    brand: 'google',
    client: 'Google',
    role: 'Creative Lead',
    year: 2014,
    duration: '1:31',
    views: '8.1M',
    videoPath: '/videos/originals/joga-mais-1.mp4',
    editPath: '/videos/edits-15s/joga-mais-1.mp4',
    posterPath: '/art/joga-mais-1.webp',
    featured: false,
    order: 7,
  },

  // ── YOUTUBE (3 films + 1 coming soon) ─────────────────────

  {
    id: 8,
    slug: 'proud-to-play',
    title: '#ProudToPlay: Celebrating Equality for All Athletes',
    tagline: {
      en: 'Stereotypes are like records. Made to be broken.',
      pt: 'Estereótipos são como recordes. Feitos para serem quebrados.',
    },
    synopsis: {
      en: "YouTube's global Pride campaign during the 2014 World Cup. Kobe Bryant, Neymar, Tom Daley, Jason Collins. Athletes and creators united against stereotypes. 6.08M views, 64.8K likes.",
      pt: 'A campanha global de Pride do YouTube durante a Copa de 2014. Kobe Bryant, Neymar, Tom Daley, Jason Collins. Atletas e criadores unidos contra estereótipos. 6,08M views, 64,8K likes.',
    },
    brand: 'youtube',
    client: 'YouTube / Google',
    role: 'Creative Lead',
    year: 2014,
    duration: '2:02',
    views: '6.08M',
    likes: '64.8K',
    awards: 'D&AD · Webby · Shorty Best Film · Ciclope Best Film · New York Festivals',
    videoPath: '/videos/originals/proud-to-play.mp4',
    editPath: '/videos/edits-15s/proud-to-play.mp4',
    posterPath: '/art/proud-to-play.webp',
    featured: true,
    heroShot: 'Shot 11 (Mandela), Shot 17 (Kobe), Shot 28 (Kobe peak)',
    order: 1,
  },
  {
    id: 9,
    slug: 'youtube-brazil-reel',
    title: 'YouTube Brazil Reel',
    tagline: {
      en: "The biggest YouTube campaign ever made in Brazil.",
      pt: 'A maior campanha do YouTube já feita no Brasil.',
    },
    synopsis: {
      en: "YouTube's largest campaign in Brazil, featuring Porta dos Fundos, Camila Coelho, and Manual do Mundo. A showcase of the platform's investment in the Brazilian creator economy.",
      pt: 'A maior campanha do YouTube no Brasil, com Porta dos Fundos, Camila Coelho e Manual do Mundo. Uma vitrine do investimento da plataforma na economia de criadores brasileira.',
    },
    brand: 'youtube',
    client: 'YouTube Brasil',
    role: 'Creative Lead',
    year: 2017,
    duration: '2:27',
    videoPath: '/videos/originals/youtube-brazil-reel.mp4',
    editPath: '/videos/edits-15s/youtube-brazil-reel.mp4',
    posterPath: '/art/youtube-brazil-reel.webp',
    featured: true,
    heroShot: 'Shot 05, Shot 18',
    order: 2,
  },
  {
    id: 10,
    slug: 'camila-interactive-makeup',
    title: 'YouTube Camila Interactive Makeup',
    tagline: {
      en: 'The first interactive beauty tutorial on YouTube Brazil.',
      pt: 'O primeiro tutorial de beleza interativo do YouTube Brasil.',
    },
    synopsis: {
      en: "The first interactive beauty tutorial on YouTube Brazil. Viewers chose their own makeup path through Camila Coelho's tutorial. A template for interactive content built for the platform.",
      pt: 'O primeiro tutorial de beleza interativo do YouTube Brasil. Os espectadores escolhiam seu próprio caminho pelo tutorial de Camila Coelho. Um modelo para conteúdo interativo pensado para a plataforma.',
    },
    brand: 'youtube',
    client: 'YouTube Brasil',
    role: 'Creative Lead',
    year: 2017,
    duration: '2:00',
    videoPath: '/videos/originals/camila-interactive-makeup.mp4',
    editPath: '/videos/edits-15s/camila-interactive-makeup.mp4',
    posterPath: '/art/camila-interactive-makeup.webp',
    featured: true,
    heroShot: 'Shot 15',
    order: 3,
  },
  {
    id: 21,
    slug: 'youtube-branding',
    title: 'YouTube Branding',
    tagline: {
      en: 'Coming soon.',
      pt: 'Em breve.',
    },
    synopsis: {
      en: 'Coming soon.',
      pt: 'Em breve.',
    },
    brand: 'youtube',
    client: 'YouTube',
    role: '',
    year: 2026,
    duration: '',
    comingSoon: true,
    videoPath: '/videos/originals/youtube-branding.mp4',
    editPath: '/videos/edits-15s/youtube-branding.mp4',
    posterPath: '/art/youtube-branding.webp',
    featured: false,
    order: 4,
  },

  // ── TIKTOK (1 film) ───────────────────────────────────────

  {
    id: 13,
    slug: 'minha-voz-importa',
    title: '#MinhaVozImporta | TikTok Brasil',
    tagline: {
      en: 'Amplifying Black voices, one story at a time.',
      pt: 'Amplificando vozes negras, uma história de cada vez.',
    },
    synopsis: {
      en: "TikTok Brazil's Black Consciousness Month campaign. Black creators, stories, and knowledge amplified across the platform. 8.2M views and massive UGC participation made it one of TikTok Brasil's most impactful campaigns.",
      pt: 'A campanha do Mês da Consciência Negra do TikTok Brasil. Criadores, histórias e conhecimento negro amplificados na plataforma. 8,2M views e participação massiva em UGC fizeram dela uma das campanhas mais impactantes do TikTok Brasil.',
    },
    brand: 'tiktok',
    client: 'TikTok Brasil',
    role: 'Creative Lead',
    year: 2020,
    duration: '0:48',
    views: '8.2M',
    videoPath: '/videos/originals/minha-voz-importa.mp4',
    editPath: '/videos/edits-15s/minha-voz-importa.mp4',
    posterPath: '/art/minha-voz-importa.webp',
    featured: true,
    heroShot: 'Shot 04, Shot 26',
    order: 1,
  },

  // ── WAZE (1 film) ─────────────────────────────────────────

  {
    id: 14,
    slug: 'get-to-know-waze',
    title: 'Get to Know Waze',
    tagline: {
      en: 'Navigate with the voices Brazil loves.',
      pt: 'Navegue com as vozes que o Brasil ama.',
    },
    synopsis: {
      en: "Waze tapped football commentators Renata Fan and Silvio Luiz as navigation voices. Brazil's commute turned into a cultural moment. 3.09M views.",
      pt: 'O Waze escalou os comentaristas Renata Fan e Silvio Luiz como vozes de navegação. O trânsito brasileiro virou momento cultural. 3,09M views.',
    },
    brand: 'waze',
    client: 'Waze (Google)',
    role: 'Creative Lead',
    year: 2014,
    duration: '0:45',
    views: '3.09M',
    videoPath: '/videos/originals/get-to-know-waze.mp4',
    editPath: '/videos/edits-15s/get-to-know-waze.mp4',
    posterPath: '/art/get-to-know-waze.webp',
    featured: false,
    order: 1,
  },

  // ── MERCADO LIVRE (1 film) ────────────────────────────────

  {
    id: 15,
    slug: 'ta-na-rede',
    title: 'TA NA REDE: Mercado Livre',
    tagline: {
      en: "When the pitch has no net, Mercado Livre delivers.",
      pt: 'Quando o campinho não tem rede, o Mercado Livre entrega.',
    },
    synopsis: {
      en: "Mercado Livre supplied real goal nets to community football pitches across Brazil that lacked them. The brand's delivery promise met grassroots football culture. 142K views.",
      pt: 'O Mercado Livre forneceu redes de gol reais para campinhos de futebol pelo Brasil que não tinham. A promessa de entrega da marca encontrou o futebol de raiz. 142K views.',
    },
    brand: 'mercado-livre',
    client: 'Mercado Livre',
    role: 'Creative Lead',
    year: 2022,
    duration: '1:00',
    views: '142K',
    awards: 'MMA Smarties LATAM 2023',
    videoPath: '/videos/originals/ta-na-rede.mp4',
    editPath: '/videos/edits-15s/ta-na-rede.mp4',
    posterPath: '/art/ta-na-rede.webp',
    featured: true,
    heroShot: 'Shot 27',
    order: 1,
  },

  // ── MOTOROLA (1 film) ─────────────────────────────────────

  {
    id: 16,
    slug: 'moto-g9',
    title: 'Familia moto g9. Voce quer. Voce tem.',
    tagline: {
      en: 'You want it. You\'ve got it.',
      pt: 'Você quer. Você tem.',
    },
    synopsis: {
      en: "Motorola's brand manifesto for the moto g9 launch in Brazil. An empowerment-driven 30-second film that became one of the most-viewed tech ads in the country. 15.5M views, 20.2K likes.",
      pt: 'O manifesto de marca da Motorola para o lançamento do moto g9 no Brasil. Um filme de 30 segundos sobre empoderamento que se tornou um dos anúncios de tech mais vistos do país. 15,5M views, 20,2K likes.',
    },
    brand: 'motorola',
    client: 'Motorola',
    role: 'Creative Lead',
    year: 2020,
    duration: '0:30',
    views: '15.5M',
    likes: '20.2K',
    results: 'Most-watched tech ad in Brazil, 2020.',
    videoPath: '/videos/originals/moto-g9.mp4',
    editPath: '/videos/edits-15s/moto-g9.mp4',
    posterPath: '/art/moto-g9.webp',
    featured: true,
    heroShot: 'Shot 13, Shot 28 (5s peak — rooftop dancers)',
    order: 1,
  },

  // ── NETFLIX (1 film — 2025 placeholder) ───────────────────

  {
    id: 17,
    slug: 'netflix-brand-partnerships',
    title: 'Netflix Brand Partnerships',
    tagline: {
      en: 'Brand partnerships that sell the story before the show drops.',
      pt: 'Parcerias de marca que vendem a história antes da série estrear.',
    },
    synopsis: {
      en: 'Creative consultant (vendor) for Netflix Brand Partnerships in 2025. Helping Netflix package tentpole launches like Stranger Things and Wednesday, and Brazilian originals like Senna and DNA do Crime, into campaigns that land with partner brands and their audiences.',
      pt: 'Creative consultant (vendor) para Netflix Brand Partnerships em 2025. Ajudando a Netflix a empacotar lançamentos-tentpole como Stranger Things e Wednesday, e originais brasileiros como Senna e DNA do Crime, em campanhas que acertam com marcas parceiras e suas audiências.',
    },
    brand: 'netflix',
    client: 'Netflix Brand Partnerships',
    role: 'Creative Consultant',
    year: 2025,
    duration: '0:04',
    videoPath: '/videos/originals/netflix-brand-partnerships.mp4',
    editPath: '/videos/originals/netflix-brand-partnerships.mp4',
    posterPath: '/art/netflix-brand-partnerships.webp',
    featured: true,
    order: 1,
  },

  // ── CAZÉTV (1 film — 2026 placeholder) ────────────────────

  {
    id: 18,
    slug: 'cazetv-fifa-world-cup-2026',
    title: 'CazéTV × FIFA World Cup 2026',
    tagline: {
      en: 'The World Cup for a generation that watches on YouTube.',
      pt: 'A Copa do Mundo para uma geração que assiste no YouTube.',
    },
    synopsis: {
      en: 'Creative Leader at CazéTV for the 2026 FIFA World Cup content operation at Livemode. Branded content for FIFA sponsors, creative team build, content strategy and direction for the tournament, and AI-augmented production workflows.',
      pt: 'Creative Leader na CazéTV na operação de conteúdo da Copa do Mundo FIFA 2026 na Livemode. Branded content para patrocinadores FIFA, construção de time criativo, estratégia e direção de conteúdo para o torneio, e workflows de produção aumentados por IA.',
    },
    brand: 'cazetv',
    client: 'CazéTV (Livemode)',
    role: 'Creative Leader',
    year: 2026,
    duration: '7:31',
    views: '50K',
    videoPath: '/videos/originals/cazetv-fifa-world-cup-2026.mp4',
    editPath: '/videos/originals/cazetv-fifa-world-cup-2026.mp4',
    posterPath: '/art/cazetv-fifa-world-cup-2026.webp',
    featured: true,
    order: 1,
  },

  // ── NUBANK (1 film + 1 coming soon) ───────────────────────────────────────

  {
    id: 19,
    slug: 'nubank-croma',
    title: 'Nubank Croma',
    tagline: {
      en: 'Naming and brand platform for Nubank’s new customer segment.',
      pt: 'Naming e plataforma de marca para o novo segmento do Nubank.',
    },
    synopsis: {
      en: 'A branding project built from zero with KOTO NYC. Nubank needed a name and a brand for a new customer segment. Working under the code name Nubank+, two rounds of naming landed on Croma, from the Greek chroma: colour, saturation, intensity. From there I led the verbal identity and brand platform: tone of voice, narrative and manifesto, message architecture, taglines and launch communications, alongside KOTO’s designers and brand architects in New York.',
      pt: 'Um projeto de branding criado do zero com a KOTO NYC. O Nubank precisava de um nome e de uma marca para um novo segmento de clientes. Sob o codinome Nubank+, duas rodadas de naming chegaram a Croma, do grego chroma: cor, saturação, intensidade. A partir daí liderei a identidade verbal e a plataforma de marca: tom de voz, narrativa e manifesto, arquitetura de mensagem, taglines e comunicação de lançamento, ao lado dos designers e arquitetos de marca da KOTO em Nova York.',
    },
    brand: 'nubank',
    client: 'Nubank',
    role: 'Creative Director & Branding Strategist (Consultant)',
    year: 2026,
    duration: '0:30',
    // No views: the launch film is Nubank's campaign, not this branding work.
    videoPath: '/videos/originals/nubank-croma.mp4',
    editPath: '/videos/edits-15s/nubank-croma.mp4',
    posterPath: '/art/nubank-croma.webp',
    featured: true,
    order: 1,
  },
  {
    id: 22,
    slug: 'more-nubank-than-ever',
    title: 'More Nubank Than Ever',
    tagline: {
      en: 'Coming soon.',
      pt: 'Em breve.',
    },
    synopsis: {
      en: 'Coming soon.',
      pt: 'Em breve.',
    },
    brand: 'nubank',
    client: 'Nubank',
    role: '',
    year: 2026,
    duration: '',
    comingSoon: true,
    videoPath: '/videos/originals/more-nubank-than-ever.mp4',
    editPath: '/videos/edits-15s/more-nubank-than-ever.mp4',
    posterPath: '/art/more-nubank-than-ever.webp',
    featured: false,
    order: 2,
  },
]

// ─── REMOVED FILMS (for reference) ────────────────────────
// #JogueComOrgulho (merged into #ProudToPlay)
// Arena de Todos (cut)
// Waze Videocase (cut, keeping only Get to Know Waze)
// Waze Dribbling Traffic Together (cut, keeping only Get to Know Waze)
// THESCIENCEBOX (cut 2026-04-23)
// PLAYTAGS (cut 2026-04-23)
// Google Photos + Android (cut 2026-04-23)
// Nubank Brand System placeholder (replaced by Nubank Croma 2026-10-06)

// ─── HELPERS ───────────────────────────────────────────────

export function getFilmsByBrand(brandSlug: BrandSlug): Film[] {
  return films
    .filter((f) => f.brand === brandSlug)
    .sort((a, b) => a.order - b.order)
}

export function getFilmBySlug(slug: string): Film | undefined {
  return films.find((f) => f.slug === slug)
}

export function getBrandBySlug(slug: BrandSlug): Brand | undefined {
  return brands.find((b) => b.slug === slug)
}

export function getBrandsOrdered(): Brand[] {
  return [...brands].sort((a, b) => a.order - b.order)
}

export function getFeaturedFilms(): Film[] {
  return films.filter((f) => f.featured)
}

/** Total views across all films (for homepage stat) */
export const totalViews = '100M+'

/** Total number of brands featured on /branded */
export const totalBrands = brands.length

/** Total films */
export const totalFilms = films.length

/** Year range */
export const yearRange = '2014–2022'
