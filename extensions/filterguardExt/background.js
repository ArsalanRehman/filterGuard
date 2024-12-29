chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getAuthToken') {
      chrome.storage.local.get('authToken', (data) => {
        console.log('authToken:', data.authToken);
        
        sendResponse({ token: data.authToken });
      });
      return true; // Keep the messaging channel open for async response
    }
  });
  