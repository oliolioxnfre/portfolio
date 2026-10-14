// Shared by every page: status bar clock, active tmux "window", and the vim-style :command line.
// Pages set <body data-root="..."> to the relative path of the site root ("./" or "../../").
import { links, projects } from "./data.js";

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const root = document.body.dataset.root || "./";

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  el.append(...children.flat().filter((c) => c != null && c !== false));
  return el;
}

/* ── status bar ──────────────────────────────────────────────── */
function startClock() {
  const el = $("#clock");
  if (!el) return;
  const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
  const tick = () => { el.textContent = fmt.format(new Date()).toLowerCase(); };
  tick();
  setInterval(tick, 15_000);
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
}

function trackWindows() {
  const tabs = new Map($$(".windows a[data-win]").map((a) => [a.dataset.win, a]));
  const sections = [...tabs.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;
  const mark = (id) => tabs.forEach((a, key) => a.setAttribute("aria-current", String(key === id)));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) mark(e.target.id);
  }, { rootMargin: "-35% 0px -60% 0px" });
  sections.forEach((s) => io.observe(s));
  // The last section is too short to reach the band above, so claim it at the bottom of the page.
  addEventListener("scroll", () => {
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 8) mark(sections.at(-1).id);
  }, { passive: true });
}

/* ── :command line ───────────────────────────────────────────── */
// Pages can add their own commands (the home page adds :boot).
export const commands = {};

function commandLine() {
  const form = $("#cmdline");
  if (!form) return;
  const input = $("#cmd-input");
  const msg = $("#cmd-msg");

  const say = (text, err = false) => { msg.textContent = text; msg.classList.toggle("err", err); };
  const open = () => { form.hidden = false; input.value = ""; say(""); input.focus(); };
  const close = () => { form.hidden = true; input.blur(); };
  // Scroll to a home-page section, or navigate home first when on a project page.
  const go = (id) => {
    close();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    else location.href = `${root}#${id}`;
  };

  Object.assign(commands, {
    help: () => say("about work projects repos contact top · e <project> · gh mail linkedin · boot · q"),
    about: () => go("about"),
    work: () => go("work"),
    projects: () => go("projects"),
    ls: () => go("projects"),
    repos: () => go("misc"),
    contact: () => go("contact"),
    top: () => go("top"),
    home: () => { close(); location.href = root; },
    "cd": (arg) => (!arg || arg === "~" || arg === "..") ? commands.home() : commands.e(arg),
    gh: () => { close(); window.open(links.github, "_blank", "noopener"); },
    mail: () => { close(); location.href = `mailto:${links.email}`; },
    linkedin: () => { close(); window.open(links.linkedin, "_blank", "noopener"); },
    e: (arg) => {
      const p = arg && projects.find((x) => x.slug.startsWith(arg) || x.name.toLowerCase().startsWith(arg));
      if (!p) return say(`E32: No file name${arg ? `: ${arg}` : ""}`, true);
      close();
      location.href = `${root}projects/${p.slug}/`;
    },
    q: close,
    "q!": close,
    wq: close,
  });
  commands.edit = commands.e;
  commands.open = commands.e;
  commands.boot ??= () => { try { sessionStorage.removeItem("booted"); } catch {} commands.home(); };
  commands.reboot = (...a) => commands.boot(...a);

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const [name, arg] = input.value.trim().split(/\s+/);
    if (!name) return close();
    const fn = commands[name.toLowerCase()];
    if (fn) fn(arg?.toLowerCase());
    else say(`E492: Not an editor command: ${name}`, true);
    input.value = "";
  });

  input.addEventListener("keydown", (ev) => { if (ev.key === "Escape") close(); });
  input.addEventListener("blur", () => setTimeout(() => { if (document.activeElement !== input) form.hidden = true; }, 120));

  document.addEventListener("keydown", (ev) => {
    if (ev.key !== ":" || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (document.documentElement.classList.contains("booting")) return;
    const t = ev.target;
    if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    ev.preventDefault();
    open();
  });
}

startClock();
trackWindows();
commandLine();
