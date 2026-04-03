const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const THEME_STORAGE_KEY = "theme-preference";

function getThemePreference() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark" || saved === "system") {
    return saved;
  }
  return "dark";
}

function resolveTheme(pref) {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function syncThemeToggle(isDark) {
  const button = document.getElementById("theme-toggle");
  const title = document.getElementById("terminal-title");
  if (button) {
    button.classList.toggle("is-dark", isDark);
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    button.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  if (title) {
    title.textContent = `~/pacho --theme=${isDark ? "silver-dark" : "silver-light"}`;
  }
}

function applyTheme(isDark) {
  document.documentElement.classList.add("disable-transitions");
  document.documentElement.classList.toggle("dark", isDark);
  window.getComputedStyle(document.documentElement).getPropertyValue("opacity");
  requestAnimationFrame(() => {
    document.documentElement.classList.remove("disable-transitions");
  });
  syncThemeToggle(isDark);
}

function initThemeToggle() {
  const button = document.getElementById("theme-toggle");
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const initialPref = getThemePreference();
  applyTheme(resolveTheme(initialPref));

  if (!button) return;

  button.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next === "dark");
  });

  mediaQuery.addEventListener("change", () => {
    const currentPref = getThemePreference();
    if (currentPref === "system") {
      applyTheme(mediaQuery.matches);
    }
  });
}

initThemeToggle();

const promptElement = document.getElementById("prompt-text");
const phrases = [
  "$ whoami",
  "$ ls -la ~/Work Experience",
  "$ ls -la ~/Projects",
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function animatePrompt() {
  if (!promptElement) return;

  const fullPhrase = phrases[phraseIndex];

  if (!deleting) {
    charIndex += 1;
    if (charIndex >= fullPhrase.length) {
      deleting = true;
      setTimeout(animatePrompt, 1400);
      promptElement.textContent = fullPhrase;
      return;
    }
  } else {
    charIndex -= 1;
    if (charIndex <= 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  promptElement.textContent = fullPhrase.slice(0, charIndex);
  setTimeout(animatePrompt, deleting ? 35 : 55);
}

animatePrompt();
