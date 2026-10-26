"use strict";

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const layer = $("#windowLayer");

let note = "";

try {
  note = localStorage.getItem("proos-note") || "";
} catch (_) {}

setTimeout(() => {
  $("#boot").classList.add("hidden");
}, 1300);

function updateClock() {
  $("#clock").textContent = new Date().toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

updateClock();
setInterval(updateClock, 1000);

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function closeWindow() {
  layer.innerHTML = "";
}

const apps = {
  files: {
    title: "Files",
    content: `
      <p>Welcome to your proOS workspace.</p>
      <div>▰ &nbsp; Documents</div>
      <div>▰ &nbsp; Projects</div>
      <div>▤ &nbsp; Welcome.txt</div>
      <p>These are sample entries, not real device files.</p>
    `
  },

  terminal: {
    title: "Terminal",
    content: `
      <div class="terminal-output" id="output">proOS Terminal v0.1
Safe browser command simulator.
Type help to see commands.

</div>
      <form class="terminal-form" id="terminalForm">
        <span>proOS $</span>
        <input id="command" autocomplete="off"
          placeholder="Enter command..." aria-label="Command">
      </form>
    `
  },

  notes: {
    title: "Notes",
    content: `
      <p>Your notes are stored in this browser.</p>
      <textarea id="noteArea" placeholder="Write something...">${escapeHTML(note)}</textarea>
      <p><button class="primary" id="saveNote">Save note</button></p>
    `
  },

  about: {
    title: "About proOS",
    content: `
      <h2>proOS Web Edition</h2>
      <p>A browser-based desktop experiment built with HTML, CSS and JavaScript.</p>
      <p>Version: 0.1</p>
      <p>Platform: Web</p>
      <p>This is an OS-style interface, not a bootable operating system.</p>
    `
  },

  settings: {
    title: "Settings",
    content: `
      <p>Personalize your desktop.</p>
      <p>Appearance</p>
      <select id="theme">
        <option value="dark">Dark emerald</option>
        <option value="light">Light</option>
      </select>
      <p>Accent colour</p>
      <select id="accent">
        <option value="green">Emerald</option>
        <option value="gold">Champagne gold</option>
        <option value="blue">Arctic blue</option>
      </select>
    `
  }
};

function openApp(name) {
  const app = apps[name];

  if (!app) return;

  closeWindow();

  const win = document.createElement("section");
  win.className = "window";
  win.setAttribute("role", "dialog");
  win.setAttribute("aria-label", app.title);

  win.innerHTML = `
    <header class="window-header">
      <span>${app.title}</span>
      <button class="close" aria-label="Close">×</button>
    </header>
    <div class="window-content">${app.content}</div>
  `;

  layer.appendChild(win);

  $(".close", win).addEventListener("click", closeWindow);

  if (name === "terminal") setupTerminal(win);
  if (name === "notes") setupNotes(win);
  if (name === "settings") setupSettings(win);
}

function setupTerminal(win) {
  const form = $("#terminalForm", win);
  const input = $("#command", win);
  const output = $("#output", win);

  const commands = {
    help: "Commands: help, clear, date, whoami, uname, ls, about",
    date: () => new Date().toString(),
    whoami: "guest",
    uname: "proOS-web 0.1",
    ls: "Documents/  Projects/  Welcome.txt",
    about: "A browser-based proOS desktop prototype."
  };

  form.addEventListener("submit", event => {
    event.preventDefault();

    const command = input.value.trim().toLowerCase();

    if (!command) return;

    if (command === "clear") {
      output.textContent = "";
    } else {
      const result = commands[command];
      const response = typeof result === "function"
        ? result()
        : result || `Command not found: ${command}`;

      output.textContent += `proOS $ ${command}\n${response}\n\n`;
    }

    output.scrollTop = output.scrollHeight;
    input.value = "";
  });

  input.focus();
}

function setupNotes(win) {
  $("#saveNote", win).addEventListener("click", () => {
    note = $("#noteArea", win).value;

    try {
      localStorage.setItem("proos-note", note);
      alert("Note saved!");
    } catch (_) {
      alert("Browser storage is unavailable.");
    }
  });
}

function setupSettings(win) {
  const theme = $("#theme", win);
  const accent = $("#accent", win);

  try {
    theme.value = localStorage.getItem("proos-theme") || "dark";
    accent.value = localStorage.getItem("proos-accent") || "green";
  } catch (_) {}

  applyTheme(theme.value);
  applyAccent(accent.value);

  theme.addEventListener("change", () => {
    applyTheme(theme.value);

    try {
      localStorage.setItem("proos-theme", theme.value);
    } catch (_) {}
  });

  accent.addEventListener("change", () => {
    applyAccent(accent.value);

    try {
      localStorage.setItem("proos-accent", accent.value);
    } catch (_) {}
  });
}

function applyTheme(theme) {
  document.body.style.background =
    theme === "light" ? "#e9f0e9" : "#07110d";

  document.body.style.color =
    theme === "light" ? "#14251a" : "#eff5ef";

  document.documentElement.style.setProperty(
    "--panel",
    theme === "light" ? "#f4f8f3" : "#101d16"
  );
}

function applyAccent(accent) {
  const colors = {
    green: "#63d69a",
    gold: "#d6bd83",
    blue: "#91d1ff"
  };

  document.documentElement.style.setProperty(
    "--green",
    colors[accent] || colors.green
  );
}

document.querySelectorAll("[data-app]").forEach(button => {
  button.addEventListener("click", () => {
    openApp(button.dataset.app);
  });
});

$("#settingsButton").addEventListener("click", () => {
  openApp("settings");
});

$("#home").addEventListener("click", closeWindow);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeWindow();

  if ((event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "k") {
    event.preventDefault();
    openApp("terminal");
  }
});
