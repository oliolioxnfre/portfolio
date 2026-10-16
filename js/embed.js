// Live-site embeds on project pages: a fake browser frame around an <iframe>.
//   .browser[data-origin]       the site being embedded
//   [role=tab][data-path]       switches the iframe to that path
//   .browser-shield             covers the iframe until clicked, so scrolling the page
//                               doesn't get trapped inside the embedded site
//   .demo-jump[data-demo]       anywhere on the page: open that path in the embed and scroll to it
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

for (const frame of document.querySelectorAll(".browser")) {
  const origin = frame.dataset.origin;
  const iframe = frame.querySelector("iframe");
  const shield = frame.querySelector(".browser-shield");
  const pathEl = frame.querySelector(".browser-path");
  const openEl = frame.querySelector(".browser-open");
  const tabs = [...frame.querySelectorAll("[role=tab]")];

  const show = (path) => {
    iframe.src = origin + path;
    pathEl.textContent = path;
    openEl.href = origin + path;
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.path === path)));
  };

  tabs.forEach((t) => t.addEventListener("click", () => show(t.dataset.path)));

  shield.addEventListener("click", () => {
    frame.classList.add("live");
    iframe.focus();
  });
  // Put the shield back once the pointer leaves, so the page scrolls normally again.
  frame.querySelector(".browser-view").addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") frame.classList.remove("live");
  });

  for (const jump of document.querySelectorAll(".demo-jump[data-demo]")) {
    jump.addEventListener("click", () => {
      show(jump.dataset.demo);
      frame.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    });
  }
}
