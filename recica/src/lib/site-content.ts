export type NavItem = {
  label: string;
  href: `#${string}` | `/${string}`;
};

export type ActionLink = {
  label: string;
  href: string;
  style?: "primary" | "secondary" | "text";
  external?: boolean;
};

export type Language = {
  name: string;
  level: string;
};

export type Fact = {
  label: string;
  value: string;
};

export type Decision = {
  title: string;
  choice: string;
  tradeoff: string;
};

export type Screenshot = {
  src: string;
  alt: string;
  caption?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  product: string;
  client: string;
  role: string;
  period: string;
  summary: string;
  context: string;
  constraints: string[];
  approach: string[];
  decisions: Decision[];
  reflection: string;
  stack: string[];
  externalHref: string;
  externalLabel: string;
  /** Reserved for the next iteration. Empty until real captures exist. */
  screenshots: Screenshot[];
};

export type ToolHighlight = {
  name: string;
  href: string;
  description: string;
  category: string;
};

export type EmployerProduct = {
  name: string;
  period: string;
  summary: string;
  caseStudySlug?: string;
};

export type Employer = {
  company: string;
  role: string;
  period: string;
  location?: string;
  summary: string;
  products: EmployerProduct[];
  highlights: string[];
};

export type Principle = {
  title: string;
  description: string;
};

export type Credential = {
  title: string;
  issuer: string;
  year: string;
};

export type Education = {
  institution: string;
  degree: string;
  period: string;
};

export type ContactLink = {
  label: string;
  href: string;
  description: string;
  primary?: boolean;
};

export const siteConfig = {
  name: "Drilon Reçica",
  firstName: "Drilon",
  domain: "recica.dev",
  origin: "https://recica.dev",
  labsUrl: "https://labs.recica.dev",
  toolsUrl: "https://tools.recica.dev",
  role: "Senior Mobile & Product Engineer",
  title: "Drilon Reçica — Senior Mobile, Android & Product Engineer",
  description:
    "Senior Mobile, Android & Product Engineer specializing in product architecture, legacy modernization, accessible mobile delivery, and practical developer tools.",
  pitch:
    "I modernize live Android products without stopping delivery, and I take 0-to-1 products from idea to a launch-ready foundation.",
  email: "drilonrecica.dev@gmail.com",
  cvPath: "/cv.pdf",
  cvPage: "/cv",
  location: "Prishtina, Kosovo",
  countryCode: "XK",
  timezone: "Central European Time",
  workStyle: "Remote-first with German and EU teams",
  availability:
    "Open to senior and lead mobile roles, modernization work, and selective consulting.",
  yearsSince: 2012,
  image: "/og/home.png",
  imageAlt:
    "Drilon Reçica, Senior Mobile & Product Engineer, Prishtina, recica.dev",
  twitterHandle: "@drilonre",
  socialLinks: [
    "https://github.com/drilonrecica",
    "https://linkedin.com/in/drilonrecica",
    "https://x.com/drilonre",
  ],
  currentEmployer: "AppDev GmbH",
} as const;

export const personId = `${siteConfig.origin}/#drilon`;

export const languages: Language[] = [
  { name: "Albanian", level: "Native" },
  { name: "German", level: "Fluent" },
  { name: "English", level: "Fluent" },
];

export const heroFacts: Fact[] = [
  {
    label: "Based in",
    value: `${siteConfig.location} · ${siteConfig.timezone}`,
  },
  { label: "Works", value: siteConfig.workStyle },
  {
    label: "Languages",
    value: languages.map((language) => language.name).join(", "),
  },
  { label: "Status", value: siteConfig.availability },
];

export const expertise: string[] = [
  "Mobile architecture",
  "Android & Flutter",
  "Kotlin & Dart",
  "Legacy refactoring",
  "Backend development",
  "Technical leadership",
];

export const navigation: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Tools", href: "#tools" },
  { label: "Contact", href: "#contact" },
  { label: "CV", href: "/cv" },
];

export const heroActions: ActionLink[] = [
  { label: "See selected work", href: "#work", style: "primary" },
  {
    label: "Email Drilon",
    href: `mailto:${siteConfig.email}`,
    style: "secondary",
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "wohin-du-willst",
    title: "Deutsche Bahn – Wohin Du Willst",
    product: "Wohin Du Willst",
    client: "Deutsche Bahn Regio, via AppDev GmbH",
    role: "Senior Android Developer",
    period: "Nov 2023 — Present",
    summary:
      "A large public mobility app balancing legacy architecture, accessibility requirements, and continuous delivery in a live Android codebase.",
    context:
      "Wohin Du Willst is DB Regio's regional travel app. The Android codebase grew over years of platform shifts and is released continuously to a large public audience, so it cannot pause for a rewrite. I joined the cross-disciplinary Android, iOS, and backend team to move the architecture forward while releases kept shipping.",
    constraints: [
      "Core flows were built on MVP and RxJava, with tight coupling between screens and data.",
      "As a public transport product, accessibility is a requirement, not a nice-to-have.",
      "Delivery never stops. Every architectural change had to ship inside a normal release train.",
    ],
    approach: [
      "Led migration paths from MVP and RxJava toward MVVM, Coroutines, and Flow in critical parts of the app.",
      "Improved accessibility and UI consistency in the same flows while reducing coupling.",
      "Kept both architectures runnable side by side so each flow could move when it was ready.",
    ],
    decisions: [
      {
        title: "Migrate by product flow, not by layer",
        choice:
          "Convert one critical flow end to end, from presenter to data stream, before starting the next.",
        tradeoff:
          "Two architectures coexist for a while. Accepted, because it keeps every release shippable and each migration reviewable.",
      },
      {
        title: "Coroutines and Flow instead of keeping RxJava",
        choice:
          "Standardize new asynchronous code on Kotlin Coroutines and Flow, with adapters only at the boundary to untouched Rx code.",
        tradeoff:
          "Boundary adapters and a learning curve for the team, in exchange for idiomatic Kotlin and less operator-heavy code.",
      },
      {
        title: "Accessibility fixed inside the refactor",
        choice:
          "Treat content descriptions, focus order, and touch targets as part of each screen's rewrite instead of a separate backlog.",
        tradeoff:
          "Slightly slower per-screen delivery, but no accessibility debt left behind by the migration.",
      },
    ],
    reflection:
      "Modernizing a live public app is mostly a sequencing problem. The technical target matters less than choosing an order that keeps the product releasable at every step.",
    stack: ["Kotlin", "Jetpack Compose", "Coroutines", "Flow", "Accessibility"],
    externalHref:
      "https://play.google.com/store/apps/details?id=de.dbregio.wohinduwillst",
    externalLabel: "Open on Play Store",
    screenshots: [],
  },
  {
    slug: "qisara",
    title: "Qisara",
    product: "Qisara",
    client: "DeenLabs GmbH",
    role: "Tech Lead & Senior Software Engineer",
    period: "2023 — 2024",
    summary:
      "An early-stage product moving from concept to a launch-ready foundation across app architecture, backend systems, and deployment.",
    context:
      "Qisara is a mobile app product built by a small early-stage team at DeenLabs GmbH. I joined as an early core member and owned the technical side from ideation to a launch-ready foundation: the app, the backend, and the infrastructure it runs on.",
    constraints: [
      "Everything started from zero: no app, no backend, no deployment pipeline.",
      "A small team had to cover both mobile platforms and the server side at once.",
      "Infrastructure had to stay affordable and fully under the team's control.",
    ],
    approach: [
      "Owned ideation, technical direction, and end-to-end implementation as an early core team member.",
      "Built the backend in Deno and TypeScript, shipped the Flutter app from scratch, and set up the product foundations around it.",
      "Implemented the core features: navigation, localization, payments, and persistence.",
    ],
    decisions: [
      {
        title: "Flutter for both platforms",
        choice:
          "One Dart codebase for Android and iOS instead of two native apps.",
        tradeoff:
          "Platform-specific polish costs more later, but a small team ships one product instead of maintaining two.",
      },
      {
        title: "Deno and TypeScript on the backend",
        choice:
          "A single TypeScript runtime with built-in tooling rather than a heavier framework stack.",
        tradeoff:
          "A smaller ecosystem than Node, accepted for simpler setup and less configuration to own.",
      },
      {
        title: "Self-hosted Coolify on a VPS",
        choice: "Deploy with Coolify on a VPS instead of a managed platform.",
        tradeoff:
          "I own the operations, in exchange for predictable cost and full control of the environment.",
      },
    ],
    reflection:
      "0-to-1 work rewards boring, well-understood choices. The foundation only needs to be right enough to keep the product moving after launch.",
    stack: ["Flutter", "Deno", "TypeScript", "Coolify", "VPS infrastructure"],
    externalHref: "https://qisara.com/",
    externalLabel: "Visit product",
    screenshots: [],
  },
  {
    slug: "edeka-scan-and-go",
    title: "EDEKA – Scan & Go",
    product: "Scan & Go",
    client: "EDEKA, via AppDev GmbH",
    role: "Senior Android Developer",
    period: "Aug 2022 — Nov 2023",
    summary:
      "A customer-facing retail product where scan-led shopping flows need to stay fast, clear, and reliable in real store use.",
    context:
      "Scan & Go lets EDEKA shoppers scan products while they shop and finish at checkout. It lives inside a large production Android app and is used in real stores, one-handed, under time pressure, and often with weak connectivity.",
    constraints: [
      "Every second of hesitation in the scan loop damages the experience and the shopper's trust.",
      "The flows sit next to checkout, where correctness and clarity matter more than novelty.",
      "New screens had to fit into a large existing codebase without destabilizing it.",
    ],
    approach: [
      "Built shopping flows linking scanning, in-store actions, and checkout-adjacent interactions inside a large production Android app.",
      "Improved UI quality and modernization in a retail environment where hesitation directly damages the experience.",
      "Kept the scan loop simple: clear states for success and failure, and quick recovery when a scan does not land.",
    ],
    decisions: [
      {
        title: "Jetpack Compose for the new flows",
        choice:
          "Build the Scan & Go screens in Compose inside a View-based app.",
        tradeoff:
          "Interop seams between Compose and existing Views, accepted for faster iteration on the new UI.",
      },
      {
        title: "Design the scan loop for the store, not the demo",
        choice:
          "Optimize for one-handed use, immediate feedback, and forgiving retries over visual flourish.",
        tradeoff:
          "A plainer interface, which is exactly what a shopper in a queue wants.",
      },
      {
        title: "Modernize the surrounding screens as they were touched",
        choice:
          "Bring UI consistency to adjacent flows during the same work instead of a separate redesign project.",
        tradeoff:
          "A wider review surface per change, in exchange for a product that feels like one app.",
      },
    ],
    reflection:
      "Retail UX is measured in the aisle. The right question for every screen was whether a shopper with a basket in one hand could finish without thinking about it.",
    stack: ["Android", "Kotlin", "Jetpack Compose", "Retail UX"],
    externalHref:
      "https://play.google.com/store/apps/details?id=de.edeka.genuss",
    externalLabel: "Open on Play Store",
    screenshots: [],
  },
];

export const featuredTools: ToolHighlight[] = [
  {
    name: "JSON Formatter / Validator",
    href: "https://tools.recica.dev/json",
    description:
      "Local formatting, validation, and parse feedback for the payloads you actually work with every day.",
    category: "Format",
  },
  {
    name: "QR Code Generator",
    href: "https://tools.recica.dev/qr",
    description:
      "Practical QR generation for text, URLs, Wi-Fi credentials, email, phone, and SMS with local exports.",
    category: "Share",
  },
  {
    name: "Regex Tester",
    href: "https://tools.recica.dev/regex",
    description:
      "Readable ECMAScript regex testing with capture groups, replace preview, and zero dependence on remote services.",
    category: "Inspect",
  },
];

export const employers: Employer[] = [
  {
    company: "AppDev GmbH",
    role: "Senior Android Developer",
    period: "Jun 2020 — Present",
    summary:
      "Large-scale public transport and retail applications for German clients, in cross-disciplinary agile teams across Android, iOS, and backend.",
    products: [
      {
        name: "Deutsche Bahn – Wohin Du Willst",
        period: "Nov 2023 — Present",
        summary:
          "Modernizing a live public mobility app without slowing delivery.",
        caseStudySlug: "wohin-du-willst",
      },
      {
        name: "EDEKA – Scan & Go",
        period: "Aug 2022 — Nov 2023",
        summary:
          "Shipping retail flows where scan-to-checkout speed and clarity mattered in store.",
        caseStudySlug: "edeka-scan-and-go",
      },
      {
        name: "RMVGo",
        period: "Jun 2020 — Aug 2022",
        summary:
          "Stabilized and improved a transit app under everyday production use.",
      },
    ],
    highlights: [
      "Modernized architectures by migrating from MVP and RxJava to MVVM with Coroutines and Flow.",
      "Improved accessibility and UI quality in public-facing products.",
      "Multi-module and white-label setups, CI/CD pipelines, and production maintenance.",
    ],
  },
  {
    company: "DeenLabs GmbH",
    role: "Tech Lead & Senior Software Engineer",
    period: "2023 — 2024",
    summary:
      "Early-stage startup member leading the ideation, architecture, and end-to-end implementation of Qisara.",
    products: [
      {
        name: "Qisara",
        period: "2023 — 2024",
        summary:
          "0-to-1 product delivery across product, app, backend, and infrastructure.",
        caseStudySlug: "qisara",
      },
    ],
    highlights: [
      "Designed and built the backend with Deno and TypeScript.",
      "Set up infrastructure on a VPS with Coolify and developed the Flutter app from scratch.",
      "Implemented navigation, localization, payments, and persistence.",
    ],
  },
  {
    company: "Adrsys GmbH & Co. KG",
    role: "Senior Android Developer",
    period: "2015 — 2020",
    summary:
      "Android applications in the fintech and insurance domains, in agile interdisciplinary teams.",
    products: [
      {
        name: "easyCredit / Fymio",
        period: "2015 — 2020",
        summary:
          "Consumer finance products built with Kotlin, Java, MVP, and MVVM.",
      },
      {
        name: "ErgoDirekt",
        period: "2015 — 2020",
        summary: "Insurance apps with the same architectural setup.",
      },
    ],
    highlights: [
      "Developed internal Flutter-based mobile applications in 2019, gaining early cross-platform experience.",
      "Built and maintained an open-source Android security library.",
      "Mentored four working students through their professional and academic development.",
    ],
  },
  {
    company: "Independent",
    role: "Android Developer",
    period: "2012 — 2015",
    summary:
      "Started Android development in 2012 and published public Play Store apps while studying, growing with the platform from Java and XML onward.",
    products: [],
    highlights: [],
  },
];

export const education: Education[] = [
  {
    institution: "University for Business and Technology",
    degree: "Computer Sciences",
    period: "2012 — 2014",
  },
];

export const credentials: Credential[] = [
  {
    title: "Android Certified Application Engineer",
    issuer: "androidatc.com",
    year: "2016",
  },
];

export const principles: Principle[] = [
  {
    title: "Product-minded engineering",
    description:
      "I treat product context as part of engineering, not as a separate concern handed over later.",
  },
  {
    title: "Modernization without reckless rewrites",
    description:
      "I move legacy systems forward incrementally, with cleaner boundaries and safer delivery at each step.",
  },
  {
    title: "Strong mobile foundations",
    description:
      "I bias toward mobile architectures teams can maintain under real release pressure.",
  },
  {
    title: "Ownership beyond the app surface",
    description:
      "I am comfortable owning the seams between app, backend, infrastructure, and product decisions.",
  },
];

export const aboutParagraphs: string[] = [
  "I have worked in Android since 2012, through the platform's shift from Java and XML toward Kotlin, Compose, Coroutines, Flow, and more maintainable architectural boundaries. I started by publishing my own apps on the Play Store, then spent a decade inside fintech, insurance, public transport, and retail products for German companies.",
  "My strongest work sits where implementation and product judgment meet: moving live systems forward without reckless rewrites, improving accessibility and UI quality, and keeping delivery dependable while the architecture changes underneath it.",
  "I am also comfortable beyond the app surface. At Qisara I owned product direction, a Flutter app, a Deno and TypeScript backend, deployment, and the decisions connecting those layers. Along the way I have maintained an open-source Android security library, mentored working students, and used Flutter to prototype and ship side projects.",
];

export const howIWorkSummary =
  "I care about clear thinking, durable systems, and product-minded execution. These four principles shape how I build software, make systems safer to evolve, and work with teams.";

export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    href: `mailto:${siteConfig.email}`,
    description:
      "Fastest route for roles, consulting, or product conversations.",
    primary: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/drilonrecica",
    description: "Work history and the quickest professional checkpoint.",
  },
  {
    label: "GitHub",
    href: "https://github.com/drilonrecica",
    description: "Public code, tools, and current technical context.",
  },
  {
    label: "CV",
    href: siteConfig.cvPage,
    description: "Full timeline as a web page, with the PDF one click away.",
  },
];

export const footerLinks: ActionLink[] = [
  { label: "Tools", href: siteConfig.toolsUrl, external: true },
  { label: "Labs", href: siteConfig.labsUrl, external: true },
  { label: "CV", href: siteConfig.cvPage },
  { label: "GitHub", href: "https://github.com/drilonrecica", external: true },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/drilonrecica",
    external: true,
  },
  { label: "X", href: "https://x.com/drilonre", external: true },
  { label: "Email", href: `mailto:${siteConfig.email}` },
];

export const sectionCopy = {
  work: {
    kicker: "Selected work",
    title: "Three products, three different kinds of ownership.",
    description:
      "Public mobility, a 0-to-1 startup product, and customer-facing retail. Each case study records the constraints, the approach, and the decisions behind it.",
  },
  experience: {
    kicker: "Experience",
    title: "The record, grouped by employer.",
    description: "Enough to scan quickly. The full CV is one click away.",
  },
  about: {
    kicker: "How I work",
    title: "Clear thinking, durable systems, product-minded execution.",
  },
  tools: {
    kicker: "Tools and labs",
    title: "Practical tools, built the same way.",
    description:
      "Browser-based utilities and public experiments for the kind of technical work teams do every day: fast, local-first, and useful without extra ceremony.",
    footer: "Tools stay privacy-first. Labs stays public and exploratory.",
  },
  contact: {
    kicker: "Contact",
    title: "Email is the fastest way in.",
    description:
      "Best for senior and lead mobile roles, modernization work, and selective consulting. I read every message.",
  },
} as const;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

export function getAdjacentCaseStudies(slug: string): {
  previous?: CaseStudy;
  next?: CaseStudy;
} {
  const index = caseStudies.findIndex((study) => study.slug === slug);
  return {
    previous: index > 0 ? caseStudies[index - 1] : undefined,
    next:
      index >= 0 && index < caseStudies.length - 1
        ? caseStudies[index + 1]
        : undefined,
  };
}
