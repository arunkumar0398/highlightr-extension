chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SAVE_HIGHLIGHT') {
    chrome.storage.local.get('highlights', (result) => {
      const highlights = result.highlights || [];
      highlights.push({
        id: crypto.randomUUID(),
        text: message.text,
        url: message.url,
        pageTitle: message.pageTitle,
        savedAt: message.savedAt,
      });
      chrome.storage.local.set({ highlights }, () => {
        sendResponse({ success: true });
      });
    });
    return true; // keep message channel open for async sendResponse
  }
});
