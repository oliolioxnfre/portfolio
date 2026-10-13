import { links, experience, projects, misc } from "./data.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function h(tag, attrs = {}, ...children) {
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

// Stable fake commit hash so the git log looks real but never changes between loads.
function shortHash(str) {
  let x = 0x811c9dc5;
  for (const ch of str) x = Math.imul(x ^ ch.codePointAt(0), 0x01000193) >>> 0;
  return x.toString(16).padStart(8, "0").slice(0, 7);
}

/* ── render: git log ─────────────────────────────────────────── */
function renderLog() {
  const list = $("#gitlog");
  experience.forEach((e, i) => {
    list.append(
      h("li", {},
        h("span", { class: "graph", "aria-hidden": "true", text: "*" }),
        h("span", { class: "hash", "aria-hidden": "true", text: shortHash(e.what + e.where) }),
        h("span", {},
          e.head && h("span", { class: "ref" }, "(", h("b", { text: "HEAD -> main" }), ") "),
          e.when && h("span", { class: "when", text: e.when + "  " }),
          h("span", { class: "what", text: `${e.what} @ ${e.where}` }),
          e.note && h("span", { class: "note", text: ` · ${e.note}` }),
        ),
      ),
    );
    if (i < experience.length - 1) {
      list.append(h("li", { "aria-hidden": "true" }, h("span", { class: "pipe", text: "|" })));
    }
  });
}

/* ── render: ls -la ~/projects ───────────────────────────────── */
function renderProjects() {
  const list = $("#projects-list");
  $("#proj-count").textContent = projects.length;

  for (const p of projects) {
    const id = `readme-${p.name}`;
    const row = h("button", { class: "ls-row", type: "button", "aria-expanded": "false", "aria-controls": id },
      h("span", { class: "perm", "aria-hidden": "true", text: "drwxr-xr-x" }),
      h("span", { class: "own", "aria-hidden": "true", text: "oliver" }),
      h("span", { class: "lang", text: p.lang }),
      h("span", { class: "name" }, h("span", { class: "nf", "aria-hidden": "true", text: p.icon }), `${p.name}/`),
      h("span", { class: "chev nf", "aria-hidden": "true", text: "\u{f054}" }),
      h("span", { class: "sum", text: p.summary }),
    );

    const body = p.body.length
      ? p.body.map((t) => h("p", { text: t }))
      : [h("p", { class: "wip", text: "# write-up in progress" })];

    const repo = p.repo
      ? h("p", { class: "repo" },
          h("a", { href: p.repo }, h("span", { class: "nf", "aria-hidden": "true", text: "\u{f09b}" }), " source"))
      : h("p", { class: "repo" }, h("span", { class: "lock" },
          h("span", { class: "nf", "aria-hidden": "true", text: "\u{f023}" }), " private repo"));

    const panel = h("div", { class: "readme", id, inert: true },
      h("div", {},
        h("div", { class: "readme-inner" },
          h("p", { class: "rcmd", "aria-hidden": "true", text: `$ cat ~/projects/${p.name}/README.md` }),
          h("h3", { text: p.name }),
          body,
          p.tags.length > 0 && h("ul", { class: "tags", "aria-label": "Stack" }, p.tags.map((t) => h("li", { text: t }))),
          repo,
        ),
      ),
    );

    row.addEventListener("click", () => toggleProject(row, panel));
    list.append(h("li", { id: `p-${p.name}` }, row, panel));
  }
}

function toggleProject(row, panel, force) {
  const open = force ?? row.getAttribute("aria-expanded") !== "true";
  row.setAttribute("aria-expanded", String(open));
  panel.classList.toggle("open", open);
  panel.inert = !open;
}

/* ── render: tree ~/misc ─────────────────────────────────────── */
function renderMisc() {
  const list = $("#misc-list");
  misc.forEach((m, i) => {
    const last = i === misc.length - 1;
    list.append(
      h("li", {},
        h("span", { class: "branch", "aria-hidden": "true", text: last ? "└──" : "├──" }),
        h("a", { href: m.url, text: `${m.name}/` }),
        h("span", { class: "tl", text: m.lang }),
        h("span", { class: "td", text: m.desc }),
      ),
    );
  });
}

/* ── optional resume link ────────────────────────────────────── */
function renderResume() {
  if (!links.resume) return;
  $("#hero-links").append(
    h("li", {}, h("a", { href: links.resume }, h("span", { class: "nf", "aria-hidden": "true", text: "\u{f15c}" }), " resume")),
  );
  $("#ping-list").append(
    h("li", {}, "64 bytes from ", h("span", { class: "k", text: "resume" }), ": ", h("a", { href: links.resume, text: "resume.pdf" })),
  );
}

/* ── status bar: clock + active window ───────────────────────── */
function startClock() {
  const el = $("#clock");
  const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
  const tick = () => { el.textContent = fmt.format(new Date()).toLowerCase(); };
  tick();
  setInterval(tick, 15_000);
  $("#year").textContent = new Date().getFullYear();
}

function trackWindows() {
  const tabs = new Map($$(".windows a").map((a) => [a.dataset.win, a]));
  const mark = (id) => tabs.forEach((a, key) => a.setAttribute("aria-current", String(key === id)));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) mark(e.target.id);
  }, { rootMargin: "-35% 0px -60% 0px" });
  $$("main > section").forEach((s) => io.observe(s));
  // The last section is too short to reach the band above, so claim it at the bottom of the page.
  addEventListener("scroll", () => {
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 8) mark("contact");
  }, { passive: true });
}

/* ── motion: reveal on scroll + typed whoami ─────────────────── */
function revealOnScroll() {
  if (reducedMotion || !("IntersectionObserver" in window)) return;
  const targets = $$("main > section:not(.hero) > *:not(.sr-only)");
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  }, { rootMargin: "0px 0px -8% 0px" });
  targets.forEach((t) => { t.classList.add("reveal"); io.observe(t); });
}

function typeWhoami() {
  // The inline script in <head> sets .will-type (first visit this session, motion allowed)
  // so the hero is hidden before first paint instead of flashing.
  const root = document.documentElement;
  if (!root.classList.contains("will-type")) return;
  try { sessionStorage.setItem("typed", "1"); } catch {}

  const cmd = $("#hero-cmd");
  const prompt = cmd.closest(".prompt");
  const text = cmd.textContent;
  cmd.textContent = "";
  prompt.classList.add("typing");

  let i = 0;
  const step = () => {
    cmd.textContent = text.slice(0, ++i);
    if (i < text.length) return setTimeout(step, 55 + Math.random() * 45);
    setTimeout(() => {
      prompt.classList.remove("typing");
      root.classList.remove("will-type");
    }, 180);
  };
  setTimeout(step, 350);
}

/* ── vim-style :command line ─────────────────────────────────── */
function commandLine() {
  const form = $("#cmdline");
  const input = $("#cmd-input");
  const msg = $("#cmd-msg");

  const go = (sel) => { $(sel)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); close(); };
  const say = (text, err = false) => { msg.textContent = text; msg.classList.toggle("err", err); };
  const open = () => { form.hidden = false; input.value = ""; say(""); input.focus(); };
  const close = () => { form.hidden = true; input.blur(); };

  const commands = {
    help: () => say("about log projects misc contact top · e <project> · gh mail linkedin · q"),
    about: () => go("#about"),
    log: () => go("#log"),
    projects: () => go("#projects"),
    ls: () => go("#projects"),
    misc: () => go(".tree-root"),
    contact: () => go("#contact"),
    top: () => go("#top"),
    gh: () => { window.open(links.github, "_blank", "noopener"); close(); },
    mail: () => { location.href = `mailto:${links.email}`; close(); },
    linkedin: () => { window.open(links.linkedin, "_blank", "noopener"); close(); },
    q: close,
    "q!": close,
    wq: close,
    e: (arg) => {
      const p = projects.find((x) => x.name.startsWith(arg ?? "\0"));
      if (!p) return say(`E32: No file name${arg ? `: ${arg}` : ""}`, true);
      const li = $(`#p-${p.name}`);
      toggleProject($(".ls-row", li), $(".readme", li), true);
      go(`#p-${p.name}`);
    },
  };
  commands.edit = commands.e;
  commands.open = commands.e;

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
    const t = ev.target;
    if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    ev.preventDefault();
    open();
  });
}

renderLog();
renderProjects();
renderMisc();
renderResume();
startClock();
trackWindows();
typeWhoami();
revealOnScroll();
commandLine();
