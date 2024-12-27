const blockedCountEl = document.getElementById("blockedCount");
const whitelistInput = document.getElementById("whitelistInput");
const addWhitelistButton = document.getElementById("addWhitelist");
const whitelistEl = document.getElementById("whitelist");

// Engellenen site sayısını alın
chrome.storage.local.get(["blockedCount"], (data) => {
  blockedCountEl.textContent = data.blockedCount || 0;
});

// Beyaz listeye site ekleme
addWhitelistButton.addEventListener("click", () => {
  const site = whitelistInput.value.trim();
  if (site) {
    chrome.storage.local.get(["whitelist"], (data) => {
      const whitelist = data.whitelist || [];
      whitelist.push(site);
      chrome.storage.local.set({ whitelist });
      updateWhitelistUI(whitelist);
    });
  }
});

// Beyaz listeyi güncelleyin
function updateWhitelistUI(whitelist) {
  whitelistEl.innerHTML = "";
  whitelist.forEach((site) => {
    const li = document.createElement("li");
    li.textContent = site;
    whitelistEl.appendChild(li);
  });
}

// Kara listeyi güncel tutun
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateBlockedCount") {
    blockedCountEl.textContent = message.count;
  }
});
