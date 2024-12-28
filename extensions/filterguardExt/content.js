import offensiveWords from './offensiveWords.js';

// Function to replace offensive words with asterisks or censor text
function censorWords(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.nodeValue;
    offensiveWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      text = text.replace(regex, '****');
    });
    node.nodeValue = text;
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      censorWords(child);
    }
  }
}

// Run the censor function on page load
window.addEventListener('load', () => {
  censorWords(document.body);
  console.log('NSFW words censored!');
});

// Observe changes to dynamically loaded content
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    for (let node of mutation.addedNodes) {
      censorWords(node);
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
