// Listen for messages from the popup or main component
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "insertText") {
      // Send a message to the content script on the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
            // Optional: Handle any response from content.js
            if (chrome.runtime.lastError) {
              console.error("Error sending message to content script:", chrome.runtime.lastError);
              sendResponse({ status: "error", message: "Failed to communicate with content script" });
            } else {
              sendResponse(response);
            }
          });
        }
      });
  
      // Return true to indicate asynchronous response
      return true;
    }
  });
  