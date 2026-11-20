const select = (id) => document.getElementById(id);
const storageKey = "life-dashboard-v1";
const defaults = {
  tasks: [],
  links: [{ name: "GitHub", url: "https://github.com/" }, { name: "Google Calendar", url: "https://calendar.google.com/" }],
  name: "",
  theme: "light"
};

function storageWarning() {
  const status = select("storage-status");
  status.hidden = false;
  status.textContent = "Penyimpanan browser tidak tersedia. Perubahan mungkin hilang saat halaman dimuat ulang.";
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Array.isArray(saved.tasks) && Array.isArray(saved.links)) {
      return { ...defaults, ...saved };
    }
  } catch {
    storageWarning();
  }
  return { ...defaults };
}

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    storageWarning();
  }
}

const state = loadState();
saveState();

const dateFormat = new Intl.DateTimeFormat("id-ID", { dateStyle: "full" });
const timeFormat = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

function updateClock() {
  const now = new Date();
  const hour = now.getHours();
  let greeting = "Selamat malam";
  if (hour >= 4 && hour < 11) greeting = "Selamat pagi";
  if (hour >= 11 && hour < 15) greeting = "Selamat siang";
  if (hour >= 15 && hour < 18) greeting = "Selamat sore";
  select("greeting").textContent = state.name ? greeting + ", " + state.name : greeting;
  select("date").textContent = dateFormat.format(now);
  select("clock").dateTime = now.toISOString();
  select("clock").textContent = timeFormat.format(now);
}

select("name").value = state.name;
select("name-form").addEventListener("submit", (event) => {
  event.preventDefault();
  state.name = select("name").value.trim();
  select("name").value = state.name;
  saveState();
  updateClock();
  event.currentTarget.closest("details").open = false;
  event.currentTarget.closest("details").querySelector("summary").focus();
});
updateClock();
setInterval(updateClock, 1000);

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  select("theme").setAttribute("aria-pressed", String(state.theme === "dark"));
}

select("theme").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState();
  applyTheme();
});
applyTheme();

function makeButton(label, handler, description) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "secondary";
  button.textContent = label;
  if (description) button.setAttribute("aria-label", description);
  button.addEventListener("click", handler);
  return button;
}

function emptyItem(message) {
  const item = document.createElement("li");
  item.className = "empty";
  item.textContent = message;
  return item;
}

function normalizedTask(text) {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

function taskError(text, currentTask) {
  if (!text.trim()) return "Masukkan nama tugas.";
  if (state.tasks.some((task) => task !== currentTask && normalizedTask(task.text) === normalizedTask(text))) {
    return "Tugas dengan nama tersebut sudah ada.";
  }
  return "";
}

function editTask(row, task, editButton) {
  const form = document.createElement("form");
  form.className = "row";
  const input = document.createElement("input");
  input.value = task.text;
  input.maxLength = 120;
  input.setAttribute("aria-label", "Nama tugas");
  const save = document.createElement("button");
  save.textContent = "Simpan";
  const original = Array.from(row.children);

  function closeEditor() {
    row.replaceChildren(...original);
    editButton.focus();
  }

  function cancelEdit() {
    select("task-status").textContent = "";
    closeEditor();
  }

  form.append(input, save, makeButton("Batal", cancelEdit));
  form.addEventListener("keydown", (event) => {
    if (event.key === "Escape") cancelEdit();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const error = taskError(input.value, task);
    if (error) {
      select("task-status").textContent = error;
      input.focus();
      return;
    }
    task.text = input.value.trim();
    original[0].querySelector("span").textContent = task.text;
    editButton.setAttribute("aria-label", "Edit " + task.text);
    original[2].setAttribute("aria-label", "Hapus " + task.text);
    saveState();
    select("task-status").textContent = "Tugas diperbarui.";
    closeEditor();
  });
  row.replaceChildren(form);
  input.focus();
  input.select();
}

function updateTaskCount() {
  const done = state.tasks.filter((task) => task.done).length;
  select("task-count").textContent = done + " / " + state.tasks.length + " selesai";
}

function renderTasks() {
  const list = select("task-list");
  list.replaceChildren();
  updateTaskCount();
  for (const task of state.tasks) {
    const row = document.createElement("li");
    row.className = "task-row";
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveState();
      updateTaskCount();
    });
    const title = document.createElement("span");
    title.textContent = task.text;
    label.append(checkbox, title);
    const edit = makeButton("Edit", () => editTask(row, task, edit), "Edit " + task.text);
    const remove = makeButton("Hapus", () => {
      state.tasks = state.tasks.filter((item) => item !== task);
      saveState();
      renderTasks();
      select("task-input").focus();
      select("task-status").textContent = "Tugas dihapus.";
    }, "Hapus " + task.text);
    row.append(label, edit, remove);
    list.append(row);
  }
  if (!state.tasks.length) list.append(emptyItem("Belum ada tugas."));
}

select("task-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = select("task-input");
  const error = taskError(input.value);
  select("task-status").textContent = error || "Tugas ditambahkan.";
  input.focus();
  if (error) return;
  state.tasks.push({ text: input.value.trim(), done: false });
  input.value = "";
  saveState();
  renderTasks();
});
renderTasks();

function websiteUrl(value) {
  try {
    const input = value.trim();
    if (!input) return null;
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(input) ? input : "https://" + input);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

function renderLinks() {
  const list = select("link-list");
  list.replaceChildren();
  for (const link of state.links) {
    const url = websiteUrl(link.url);
    if (!url) continue;
    const row = document.createElement("li");
    row.className = "link-row";
    const anchor = document.createElement("a");
    anchor.className = "link-button";
    anchor.textContent = link.name;
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    row.append(anchor, makeButton("Hapus", () => {
      state.links = state.links.filter((item) => item !== link);
      saveState();
      renderLinks();
      select("link-form").closest("details").querySelector("summary").focus();
      select("link-status").textContent = "Tautan dihapus.";
    }, "Hapus tautan " + link.name));
    list.append(row);
  }
  if (!list.children.length) list.append(emptyItem("Belum ada tautan."));
}

select("link-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = select("link-name").value.trim();
  const url = websiteUrl(select("link-url").value);
  if (!name || !url) {
    select("link-status").textContent = "Isi nama dan alamat situs HTTP atau HTTPS yang valid.";
    select(name ? "link-url" : "link-name").focus();
    return;
  }
  state.links.push({ name, url });
  saveState();
  renderLinks();
  event.currentTarget.reset();
  select("link-name").focus();
  select("link-status").textContent = "Tautan disimpan.";
});
renderLinks();

const sessionLength = 25 * 60 * 1000;
let remaining = sessionLength;
let deadline = null;
let timerInterval = null;

function renderTimer() {
  const seconds = Math.ceil(remaining / 1000);
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  select("timer").textContent = minutes + ":" + String(seconds % 60).padStart(2, "0");
  select("progress").value = sessionLength - remaining;
  select("start").disabled = deadline !== null;
  select("stop").disabled = deadline === null;
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  deadline = null;
}

function tick() {
  remaining = Math.max(0, deadline - Date.now());
  if (remaining === 0) {
    stopTimer();
    select("timer-status").textContent = "Sesi fokus selesai.";
  }
  renderTimer();
}

select("start").addEventListener("click", () => {
  if (deadline !== null) return;
  if (remaining === 0) remaining = sessionLength;
  deadline = Date.now() + remaining;
  timerInterval = setInterval(tick, 200);
  select("timer-status").textContent = "Sesi fokus berjalan.";
  renderTimer();
  select("stop").focus();
});

select("stop").addEventListener("click", () => {
  tick();
  if (remaining > 0) {
    stopTimer();
    select("timer-status").textContent = "Sesi fokus dijeda.";
    renderTimer();
  }
  select("start").focus();
});

select("reset").addEventListener("click", () => {
  stopTimer();
  remaining = sessionLength;
  select("timer-status").textContent = "Timer kembali ke 25 menit.";
  renderTimer();
});
renderTimer();
