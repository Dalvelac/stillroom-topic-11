// Keep bookmarks to the original web film working from the presentation overview.
if (document.getElementById("film-guide") && location.hash === "#film") {
  location.replace("web.html#film");
}
const player = document.querySelector("video");
for (const button of document.querySelectorAll("[data-seek]")) {
  button.addEventListener("click", () => {
    player.currentTime = Number(button.dataset.seek);
    player.play().catch(() => player.focus());
  });
}
const form = document.querySelector(".ref-form");
const localEditor = location.protocol === "file:" || ["127.0.0.1", "localhost", "[::1]"].includes(location.hostname);
if (form && localEditor) {
  form.closest("details").hidden = false;
  const fields = ["name", "opinion", "contribution"];
  const saved = window.stillroomReflection || {};
  const key = "stillroom-topic11-reflection-v1";
  let draft = null;
  try { draft = JSON.parse(localStorage.getItem(key)); } catch {}
  const values = () => Object.fromEntries(fields.map(k => [k, form.elements[k].value.trim()]));
  function render(data) {
    for (const field of fields) {
      const text = typeof data[field] === "string" ? data[field] : "";
      form.elements[field].value = text;
      document.querySelector("[data-ref=" + field + "]").textContent = text;
    }
    document.querySelector('[data-ref="name"]').hidden = !data.name;
    document.querySelector("#contribution-title").hidden = !data.contribution;
    const filled = Boolean(data.opinion || data.contribution);
    document.querySelector("#reflection-text").hidden = !filled;
    document.querySelector("#reflection-empty").hidden = filled;
  }
  render(draft || saved);
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = values();
    render(data);
    try { localStorage.setItem(key, JSON.stringify(data)); form.querySelector(".status").textContent = "Draft saved in this browser."; }
    catch { form.querySelector(".status").textContent = "Preview updated. Export the reflection file to keep it."; }
  });
  form.querySelector("[data-export]").addEventListener("click", () => {
    const data = values();
    const blob = new Blob(["window.stillroomReflection = " + JSON.stringify(data, null, 2) + ";\n"], {type:"text/javascript"});
    const target = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = target; a.download = "reflection.js"; a.click();
    setTimeout(() => URL.revokeObjectURL(target), 1000);
    render(data);
    form.querySelector(".status").textContent = "Place the downloaded reflection.js beside index.html to include it in the portable site.";
  });
}
