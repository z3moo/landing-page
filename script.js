const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

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
