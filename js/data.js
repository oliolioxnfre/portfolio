// Site content. Edit this file to update projects, experience and links;
// the home page renders these lists on load.

export const links = {
  github: "https://github.com/oliolioxnfre",
  email: "oli.m.king@proton.me",
  linkedin: "https://www.linkedin.com/in/oliver-m-king",
  // Drop a PDF at assets/resume.pdf and set this to "assets/resume.pdf" to show the link.
  resume: null,
};

// Rendered as a timeline, newest first. `when` is free text; leave it empty to omit.
export const experience = [
  { when: "Jul–Aug 2026", what: "Intern", where: "Appenza", note: "Egypt" },
  { when: "Present", what: "Vice President", where: "RUSLUG", note: "Rutgers University Student Linux User Group" },
  { when: "", what: "B.S. Computer Science", where: "Rutgers University", note: "New Brunswick, NJ" },
];

// Rendered as the project grid. Each card links to projects/<slug>/, a hand-written page.
// `image` is relative to the site root. `repo: null` marks a private repo.
export const projects = [
  {
    slug: "homelab",
    name: "Homelab",
    image: "assets/img/projects/homelab.webp",
    summary: "Proxmox node running an Active Directory domain, pfSense, Splunk and a remote GPU-passthrough desktop.",
    tags: ["proxmox", "active directory", "networking"],
    repo: null,
  },
  {
    slug: "djwya",
    name: "DJWYA",
    image: "assets/img/projects/djwya.webp",
    summary: "Ranks electronic music festivals by how closely their lineups match your listening history.",
    tags: ["next.js", "python", "postgres", "d3"],
    repo: null,
  },
  {
    slug: "esp32-matrix",
    name: "ESP32-Matrix",
    image: "assets/img/projects/esp32-matrix.webp",
    summary: "ESP32-S3 desk display on eight LED matrices in a 3D-printed case: stocks, clock, timer, games.",
    tags: ["c++", "esp32-s3", "hardware"],
    repo: "https://github.com/oliolioxnfre/ESP32AttiaMatrix",
  },
  {
    slug: "mojo-agent",
    name: "Mojo Agent",
    image: "assets/img/projects/mojo-agent.webp",
    summary: "Voice-first executive assistant for email and WhatsApp that never sends without approval.",
    tags: ["typescript", "postgres", "llm"],
    repo: null,
  },
  {
    slug: "bios-programming",
    name: "BIOS Programming",
    image: "assets/img/projects/bios-programming.webp",
    summary: "Low-level programming at the BIOS / firmware layer.",
    tags: ["firmware"],
    repo: null,
  },
];

// Rendered as the compact "Other repos" list under the grid.
export const misc = [
  { name: "hyprcoop", lang: "rust", desc: "split-screen co-op launcher for Hyprland (bwrap-isolated gamepads, TUI)", url: "https://github.com/oliolioxnfre/hyprcoop" },
  { name: "custom-shell", lang: "c", desc: "unix shell: fork/execv, pipes, dup2, globbing", url: "https://github.com/oliolioxnfre/Custom-Shell" },
  { name: "custom-memory-allocator", lang: "c", desc: "malloc/free in C with block splitting and coalescing", url: "https://github.com/oliolioxnfre/Custom-Memory-Allocator" },
  { name: "my-dns-resolver", lang: "python", desc: "recursive DNS over TCP: root, TLD, authoritative", url: "https://github.com/oliolioxnfre/My-DNS-Resolver" },
  { name: "neoslug", lang: "html", desc: "the RUSLUG website, no JS, text-browser friendly", url: "https://github.com/oliolioxnfre/neoslug" },
];
