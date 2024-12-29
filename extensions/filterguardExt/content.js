let offensiveWords = ["NSFW", "nsfw", 'Rock' ]; // Static default list

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
    url: window.location.href,
    censorStatus: status,
  };

  chrome.runtime.sendMessage({ type: 'getAuthToken' }, async (response) => {
    if (response.token) {
      try {
        const tokenParts = response.token.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format');
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        const userId = payload.id;

        if (!userId) {
          throw new Error('User ID not found in token');
        }

        logData.userId = userId;

        chrome.runtime.sendMessage(
          {
            type: 'proxyFetch',
            url: 'http://127.0.0.1:5050/api/v1/log/createLog',
            options: {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(logData),
            },
          },
          (response) => {
            if (response.success) {
              // alert(`Log sent successfully: ${JSON.stringify(logData)}`);
            } else {
              // alert(`Error sending log: ${response.error}`);
            }
          }
        );
      } catch (error) {
        // alert(`Error: ${error.message}`);
      }
    } else {
      // alert('No token found. Log could not be sent.');
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
          // alert(`Failed to fetch wordlist: ${res.statusText}`);
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
  // await fetchWordlist(); // Fetch the dynamic wordlist from the backend

  censorWords(document.body); // Censor the content on the page

  const content = document.body.textContent || '';
  alert(`Content: ${content}`);
  const status = isCensored(content) ? 'Censored' : 'Not Censored';

  await sendLog(status); // Log the censor status and page details
  // alert('NSFW words censored and log recorded!');
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
