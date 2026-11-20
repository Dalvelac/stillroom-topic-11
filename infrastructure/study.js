const player = document.getElementById("player");
const chapters = Array.from(document.querySelectorAll("#chapter-list a"), (link) => {
  const button = document.createElement("button");
  button.type = "button";
  button.append(...link.childNodes);
  link.replaceWith(button);
  const start = Number(link.dataset.start);
  button.addEventListener("click", () => {
    player.currentTime = start;
    player.play().catch(() => player.focus());
  });
  return { button, start };
});

function highlightChapter() {
  const current = chapters.findLast((chapter) => chapter.start <= player.currentTime + 0.001);
  for (const chapter of chapters) {
    if (chapter === current) chapter.button.setAttribute("aria-current", "true");
    else chapter.button.removeAttribute("aria-current");
  }
}
player.addEventListener("timeupdate", highlightChapter);
player.addEventListener("seeked", highlightChapter);
highlightChapter();
document.getElementById("watch").addEventListener("click", () => {
  player.play().catch(() => player.focus());
});

const tablist = document.querySelector(".exhibits");
const tabs = Array.from(tablist.querySelectorAll("a"));
tablist.setAttribute("role", "tablist");
function showExhibit(hash) {
  const selected = tabs.find((tab) => tab.hash === hash);
  if (!selected) return;
  for (const tab of tabs) {
    const active = tab === selected;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    document.querySelector(tab.hash).hidden = !active;
  }
}
for (const [index, tab] of tabs.entries()) {
  const panel = document.querySelector(tab.hash);
  tab.id = "tab-" + panel.id;
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", panel.id);
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", tab.id);
  panel.tabIndex = 0;
  tab.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showExhibit(tab.hash);
    if (location.hash !== tab.hash) history.pushState(null, "", tab.hash);
  });
  tab.addEventListener("keydown", (event) => {
    const directions = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1
    };
    if (!(event.key in directions)) return;
    event.preventDefault();
    const next = tabs[directions[event.key]];
    next.focus();
    next.click();
  });
}
function syncExhibit() {
  showExhibit(tabs.some((tab) => tab.hash === location.hash) ? location.hash : tabs[0].hash);
}
syncExhibit();
window.addEventListener("hashchange", syncExhibit);
