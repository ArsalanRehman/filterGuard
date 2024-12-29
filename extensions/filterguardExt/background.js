chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getAuthToken') {
    chrome.storage.local.get('authToken', (data) => {
      console.log('authToken:', data.authToken);
      sendResponse({ token: data.authToken });
    });
    return true; // Keep the messaging channel open for async response
  }

  // Handle proxy fetch requests
  if (request.type === 'proxyFetch') {
    fetch(request.url, {
      method: request.options.method,
      headers: request.options.headers,
      body: request.options.body,
    })
      .then(async (response) => {
        const contentType = response.headers.get('Content-Type');
        let responseData;
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
        sendResponse({ success: true, data: responseData });
      })
      .catch((error) => {
        console.error('Proxy Fetch Error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep the messaging channel open for async response
  }
});
