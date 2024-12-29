let offensiveWords = ["NSFW", "nsfw", ]; // Static default list

// Function to replace offensive words with asterisks
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

// Function to check if content contains offensive words
function isCensored(content) {
  return offensiveWords.some((word) => new RegExp(`\\b${word}\\b`, 'gi').test(content));
}

// Function to send log data to the backend
async function sendLog(status) {
  const logData = {
    url: window.location.href, // Current page URL
    censorStatus: status,      // Whether the page was censored or not
  };

  chrome.runtime.sendMessage({ type: 'getAuthToken' }, async (response) => {
    if (response.token) {
      try {
        const res = await fetch('http://127.0.0.1:5050/api/v1/log/createLog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${response.token}`, // Include the token in the request header
          },
          body: JSON.stringify(logData),
        });

        if (!res.ok) {
          alert(`Failed to send log: ${res.statusText}`);
        } else {
          alert(`Log sent successfully: ${JSON.stringify(logData)}`);
        }
      } catch (error) {
        alert(`Error sending log: ${error.message}`);
      }
    } else {
      alert('No token found. Log could not be sent.');
    }
  });
}

// Function to dynamically fetch offensive words from the backend
async function fetchWordlist() {
  try {
    chrome.runtime.sendMessage({ type: 'getAuthToken' }, async (response) => {
      alert(`Token response: ${JSON.stringify(response)}`);

      if (response.token) {
        const res = await fetch('http://127.0.0.1:5050/api/v1/blacklist/getAllBlackList', {
          method: 'GET',
        });

        if (res.ok) {
          const wordlist = await res.json();
          offensiveWords = [
            ...new Set([...offensiveWords, ...wordlist.data.blacklistedWords.map((item) => item.wordList)]),
          ];
          alert(`Fetched offensive wordlist: ${offensiveWords}`);
        } else {
          alert(`Failed to fetch wordlist: ${res.statusText}`);
        }
      } else {
        alert('No token found. Could not fetch wordlist.');
      }
    });
  } catch (error) {
    alert(`Error fetching wordlist: ${error.message}`);
  }
}

// Main function to run the censoring and logging process
async function main() {
  await fetchWordlist(); // Fetch the dynamic wordlist from the backend

  censorWords(document.body); // Censor the content on the page

  const content = document.body.textContent || '';
  const status = isCensored(content) ? 'Censored' : 'Not Censored';

  await sendLog(status); // Log the censor status and page details
  alert('NSFW words censored and log recorded!');
}

// Observe dynamically loaded content
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    for (let node of mutation.addedNodes) {
      censorWords(node); // Censor new content added dynamically
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Run the main function on page load
window.addEventListener('load', main);
