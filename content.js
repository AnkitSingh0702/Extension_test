chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "insertText") {
        const messageInput = document.querySelector('input[aria-label="Write a message..."]');
        if (messageInput) {
            messageInput.value = request.text;
            messageInput.dispatchEvent(new Event('input', { bubbles: true }));
            sendResponse({ status: "success" });
        } else {
            sendResponse({ status: "error", message: "Message input field not found." });
        }
    }
});
