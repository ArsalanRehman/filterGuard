let blacklist = [];
let whitelist = [];
let badWords = ["kötü kelime 1", "kötü kelime 2", "çocuklar için uygun olmayan terimler"];

// Kara listeyi ve beyaz listeyi yükle
chrome.runtime.onInstalled.addListener(() => {
  fetch("blacklist.json").then((response) => response.json()).then((data) => { blacklist = data.blacklist; });
  chrome.storage.local.get(["whitelist"], (data) => { whitelist = data.whitelist || []; });
});

// Kara listedeki siteleri ve görselleri engelle
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    if (isImage(url.pathname)) {
      if (containsInappropriateImage(url)) {
        return { cancel: true };
      }
    } else if (details.type === "main_frame" || details.type === "sub_frame") {
      if (containsInappropriateText(details.url)) {
        return { cancel: true };
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// VPN kontrolü
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    if (isVPN(url.hostname)) {
      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Görsellerde uygunsuz içerik kontrolü
function containsInappropriateImage(url) {
  return /kotu-resimler|çocuklar için uygun olmayan görüntüler/.test(url.toLowerCase());
}

// Metinlerde uygunsuz içerik kontrolü
function containsInappropriateText(url) {
  return badWords.some(word => url.includes(word.toLowerCase()));
}

// Görsel kontroller için basit regex
function isImage(pathname) {
  return /\.(jpg|jpeg|png|gif|bmp)$/i.test(pathname);
}

// VPN kontrolü
function isVPN(hostname) {
  const vpnProviders = ["vpnprovider1.com", "vpnprovider2.com"];
  return vpnProviders.some((provider) => hostname.includes(provider));
}
