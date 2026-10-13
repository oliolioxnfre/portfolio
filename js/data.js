// Site content. Edit this file to update projects, experience and links;
// the page renders these lists on load.

export const links = {
  github: "https://github.com/oliolioxnfre",
  email: "oli.m.king@proton.me",
  linkedin: "https://www.linkedin.com/in/oliver-m-king",
  // Drop a PDF at assets/resume.pdf and set this to "assets/resume.pdf" to show the link.
  resume: null,
};

// Rendered as `git log`, newest first. `when` is free text; leave it empty to omit.
export const experience = [
  { when: "jul–aug 2026", what: "intern", where: "Appenza", note: "Egypt", head: true },
  { when: "present", what: "vice president", where: "RUSLUG", note: "Rutgers University Student Linux User Group" },
  { when: "", what: "b.s. computer science", where: "Rutgers University", note: "New Brunswick, NJ" },
];

// Rendered as `ls -la ~/projects`. `icon` is a Nerd Font codepoint that exists in the
// subset font (see README). `repo: null` marks a private repo.
export const projects = [
  {
    name: "homelab",
    icon: "\u{f233}",
    lang: "infra",
    summary: "Self-hosted infrastructure running at home.",
    // TODO(oliver): hardware, OS/hypervisor, services, what you learned.
    body: [],
    tags: ["linux", "self-hosting"],
    repo: null,
    wip: true,
  },
  {
    name: "djwya",
    icon: "\u{f001}",
    lang: "ts",
    summary: "Spotify-based web app that finds where your favorite DJs are performing.",
    body: [
      "Reads your Spotify listening to work out which DJs you care about, then scours festival lineups and event listings to tell you where they're playing next.",
      "Python ingestion service and scrapers feed a TypeScript web app; it also builds a \"sonic DNA\" profile for each genre.",
    ],
    tags: ["typescript", "python", "spotify api", "scraping"],
    repo: null,
  },
  {
    name: "esp32-matrix",
    icon: "\u{f2db}",
    lang: "c++",
    summary: "Desk ticker on an ESP32-S3 driving eight chained MAX7219 LED matrices.",
    body: [
      "Shows a synced clock and live stock prices, and plays Tetris and Stacker on its hardware buttons.",
      "The display runs over SPI. Four active-low buttons with internal pull-ups handle power, screen cycling and game input, and a long press resets WiFi.",
    ],
    tags: ["c++", "esp32-s3", "max7219", "spi", "embedded"],
    repo: "https://github.com/oliolioxnfre/ESP32AttiaMatrix",
  },
  {
    name: "mojo-agent",
    icon: "\u{f06a9}",
    lang: "ts",
    summary: "Voice-first executive assistant for email and WhatsApp that never sends anything without approval.",
    body: [
      "Ingests mail and messages, briefs its user each morning on what actually matters, and drafts replies that can be approved by swipe or by voice.",
      "Every outbound action goes through a proposals table guarded by a Postgres trigger, and the known bypass paths are attack-tested. Model calls go through a logged, provider-agnostic gateway, and credentials sit in an encrypted store.",
    ],
    tags: ["typescript", "postgres", "microsoft graph", "realtime voice", "llm"],
    repo: null,
  },
  {
    name: "bios-programming",
    icon: "\u{f4bc}",
    lang: "fw",
    summary: "Low-level programming at the BIOS / firmware layer.",
    // TODO(oliver): what you built, which toolchain, what ran on bare metal. Add tags too.
    body: [],
    tags: [],
    repo: null,
    wip: true,
  },
];

// Rendered as `tree ~/misc`.
export const misc = [
  { name: "hyprcoop", lang: "rust", desc: "split-screen co-op launcher for Hyprland (bwrap-isolated gamepads, TUI)", url: "https://github.com/oliolioxnfre/hyprcoop" },
  { name: "custom-shell", lang: "c", desc: "unix shell: fork/execv, pipes, dup2, globbing", url: "https://github.com/oliolioxnfre/Custom-Shell" },
  { name: "custom-memory-allocator", lang: "c", desc: "malloc/free in C with block splitting and coalescing", url: "https://github.com/oliolioxnfre/Custom-Memory-Allocator" },
  { name: "my-dns-resolver", lang: "python", desc: "recursive DNS over TCP: root, TLD, authoritative", url: "https://github.com/oliolioxnfre/My-DNS-Resolver" },
  { name: "neoslug", lang: "html", desc: "the RUSLUG website, no JS, text-browser friendly", url: "https://github.com/oliolioxnfre/neoslug" },
];
