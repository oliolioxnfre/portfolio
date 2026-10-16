import { $, $$, h, commands, reducedMotion } from "./shell.js";
import { links, experience, projects, misc } from "./data.js";

const html = document.documentElement;

/* ── render ──────────────────────────────────────────────────── */
function renderTimeline() {
  $("#timeline").append(...experience.map((e) =>
    h("li", {},
      h("span", { class: "when", text: e.when }),
      h("span", { class: "dot", "aria-hidden": "true" }),
      h("div", {},
        h("span", { class: "what", text: e.what }), " ",
        h("span", { class: "where", text: `@ ${e.where}` }),
        e.note && h("span", { class: "note", text: e.note }),
      ),
    ),
  ));
}

function renderGrid() {
  $("#project-grid").append(...projects.map((p, i) =>
    h("li", { style: `--i:${i}` },
      h("a", { class: "card", href: `projects/${p.slug}/` },
        h("div", { class: "card-art" },
          h("img", { src: p.image, alt: "", loading: "lazy", decoding: "async", style: `view-transition-name: logo-${p.slug}` })),
        h("div", { class: "card-body" },
          h("h3", { class: "card-title" }, h("span", { text: p.name }), h("span", { class: "go", "aria-hidden": "true", text: "→" })),
          h("p", { class: "card-sum", text: p.summary }),
          h("ul", { class: "tags", "aria-label": "Stack" }, p.tags.map((t) => h("li", { text: t }))),
        ),
      ),
    ),
  ));
}

function renderMisc() {
  $("#misc-list").append(...misc.map((m) =>
    h("li", {},
      h("a", { href: m.url },
        h("span", { class: "r-name", text: m.name }),
        h("span", { class: "r-lang", text: m.lang }),
        h("span", { class: "r-desc", text: m.desc }),
        h("span", { class: "r-go", "aria-hidden": "true", text: "↗" }),
      ),
    ),
  ));
}

function renderResume() {
  if (!links.resume) return;
  const icon = () => h("span", { class: "nf", "aria-hidden": "true", text: "\u{f15c}" });
  $("#hero-links").append(h("li", {}, h("a", { href: links.resume, target: "_blank", rel: "noopener" }, icon(), " resume")));
  $("#contact-list").append(h("li", {}, h("a", { href: links.resume, target: "_blank", rel: "noopener" },
    icon(), h("span", { class: "c-k", text: "resume" }), h("span", { class: "c-v", text: "resume.pdf" }))));
}

/* ── reveal on scroll ────────────────────────────────────────── */
function revealOnScroll() {
  if (reducedMotion || !("IntersectionObserver" in window)) return;
  const targets = $$(".sec-head, .about-grid, .photo, .timeline > li, .grid > li, .sub-head, .repos, .contact > li");
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  }, { rootMargin: "0px 0px -6% 0px" });
  targets.forEach((t) => { t.classList.add("reveal"); io.observe(t); });
}

/* ── boot sequence ───────────────────────────────────────────── */
// GRUB menu → kernel/systemd log → tty login → the hero prompt types `whoami` → page appears.
// Any key, click or scroll skips straight to the page. Plays once per browser session.
const SKIP = Symbol("skip");
let skipped = false;
const pending = new Set();

function wait(ms) {
  if (skipped) return Promise.reject(SKIP);
  return new Promise((resolve, reject) => {
    const cancel = () => { clearTimeout(t); reject(SKIP); };
    const t = setTimeout(() => { pending.delete(cancel); resolve(); }, ms);
    pending.add(cancel);
  });
}

const jitter = (base, spread) => base + Math.random() * spread;

async function typeText(el, text, speed = 75) {
  for (const ch of text) {
    el.textContent += ch;
    await wait(jitter(speed * 0.7, speed * 0.7));
  }
}

function lastLogin() {
  const d = new Date(Date.now() - 26 * 3600e3 - Math.random() * 6 * 3600e3);
  const day = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" }).replace(",", "");
  return `${day} ${d.toTimeString().slice(0, 8)} on tty1`;
}

async function bootSequence() {
  const screen = $("#boot-screen");
  const cmd = $("#hero-cmd");
  const prompt = cmd.closest(".prompt");
  screen.replaceChildren();
  cmd.textContent = "";

  // 1. GRUB
  const countdown = h("span", { text: "2s" });
  screen.append(h("div", { class: "grub" },
    h("div", { class: "grub-title", text: "GNU GRUB  version 2.12" }),
    h("div", { class: "grub-box" },
      h("div", { class: "sel", text: "*Arch Linux" }),
      h("div", { text: " Advanced options for Arch Linux" }),
      h("div", { text: " UEFI Firmware Settings" })),
    h("div", { class: "grub-help" },
      "Use the ↑ and ↓ keys to select which entry is highlighted. Press enter to boot the selected OS. ",
      "The highlighted entry will be executed automatically in ", countdown, "."),
  ));
  await wait(650);
  countdown.textContent = "1s";
  await wait(600);

  // 2. kernel + systemd
  screen.replaceChildren();
  const log = (htmlText, cls) => { const d = h("div", { class: cls }); d.innerHTML = htmlText; screen.append(d); };
  log("Loading Linux linux ...", "mut");
  log("Loading initial ramdisk ...", "mut");
  await wait(320);
  screen.replaceChildren();
  log("[    0.000000] Linux version 6.17.2-arch1-1 (linux@archlinux)", "mut");
  log("[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-linux rw loglevel=3", "mut");
  await wait(140);
  const units = [
    "Reached target <span class=hi>Local File Systems</span>.",
    "Started <span class=hi>NetworkManager.service</span> - Network Manager.",
    "Mounted <span class=hi>/home/oliver</span>.",
    "Started <span class=hi>rutgers-cs.service</span> - B.S. Computer Science.",
    "Started <span class=hi>ruslug.service</span> - Rutgers Student Linux User Group.",
    "Started <span class=hi>homelab.service</span> - Proxmox cluster.",
    "Started <span class=hi>djwya.service</span> - DJ tour tracker.",
    "Started <span class=hi>esp32-matrix.service</span> - LED matrix ticker.",
    "Started <span class=hi>mojo-agent.service</span> - Approval gate armed.",
    "Started <span class=hi>bios.service</span> - Firmware experiments.",
    "Reached target <span class=hi>Multi-User System</span>.",
  ];
  for (const u of units) {
    log(`[<span class=ok>  OK  </span>] ${u}`);
    await wait(jitter(45, 70));
  }
  await wait(380);

  // 3. tty login
  screen.replaceChildren();
  await wait(220);
  log("Arch Linux 6.17.2-arch1-1 (tty1)");
  log(" ");
  const loginLine = h("div", {}, "nyc login: ");
  const typed = h("span");
  const cursor = h("span", { class: "cursor" });
  loginLine.append(typed, cursor);
  screen.append(loginLine);
  await wait(420);
  await typeText(typed, "oliver", 90);
  await wait(200);
  cursor.remove();
  const pw = h("div", {}, "Password: ", cursor);
  screen.append(pw);
  await wait(750);
  cursor.remove();
  log(`Last login: ${lastLogin()}`, "mut");
  await wait(550);

  // 4. "clear": the overlay goes away and the page's own prompt becomes the terminal.
  html.classList.remove("booting");
  prompt.classList.add("typing");
  await wait(450);
  await typeText(cmd, "whoami", 85);
  await wait(260);
  prompt.classList.remove("typing");
  html.classList.remove("intro");
}

function finishBoot() {
  pending.forEach((cancel) => cancel());
  pending.clear();
  $("#hero-cmd").textContent = "whoami";
  $("#hero-cmd").closest(".prompt").classList.remove("typing");
  html.classList.remove("booting", "intro");
  removeEventListener("keydown", onSkip, true);
  removeEventListener("pointerdown", onSkip, true);
  removeEventListener("wheel", onSkip, true);
  removeEventListener("touchstart", onSkip, true);
}

function onSkip(ev) {
  if (ev.type === "keydown" && ["Shift", "Meta", "Control", "Alt"].includes(ev.key)) return;
  // The skip input shouldn't also act on the page that appears underneath it.
  if (ev.type === "keydown") ev.preventDefault();
  if (ev.type === "pointerdown") {
    const swallow = (e) => { e.preventDefault(); e.stopPropagation(); };
    addEventListener("click", swallow, { capture: true, once: true });
    setTimeout(() => removeEventListener("click", swallow, true), 600);
  }
  skipped = true;
  finishBoot();
}

async function runBoot() {
  try { sessionStorage.setItem("booted", "1"); } catch {}
  skipped = false;
  addEventListener("keydown", onSkip, true);
  addEventListener("pointerdown", onSkip, true);
  addEventListener("wheel", onSkip, { capture: true, passive: true });
  addEventListener("touchstart", onSkip, { capture: true, passive: true });
  try {
    await bootSequence();
  } catch (err) {
    if (err !== SKIP) throw err;
  }
  finishBoot();
}

function reboot() {
  if (reducedMotion) return;
  scrollTo({ top: 0, behavior: "instant" });
  html.classList.add("booting", "intro");
  // Let the click that triggered this finish before listening for skip input.
  setTimeout(runBoot, 50);
}

/* ── init ────────────────────────────────────────────────────── */
renderTimeline();
renderGrid();
renderMisc();
renderResume();
revealOnScroll();

commands.boot = () => { $("#cmdline").hidden = true; reboot(); };
$("#reboot").addEventListener("click", reboot);
if (reducedMotion) $("#reboot").hidden = true;

if (html.classList.contains("booting")) runBoot();
