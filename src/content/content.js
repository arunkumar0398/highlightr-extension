let tooltip = null;

function removeTooltip() {
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
}

document.addEventListener('mouseup', (e) => {
  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (!text) return;

    removeTooltip();

    tooltip = document.createElement('div');
    tooltip.id = 'highlightr-tooltip';
    tooltip.textContent = '💾 Save Highlight';
    tooltip.style.top = `${e.clientY - 44}px`;
    tooltip.style.left = `${e.clientX}px`;

    tooltip.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        type: 'SAVE_HIGHLIGHT',
        text,
        url: window.location.href,
        pageTitle: document.title,
        savedAt: new Date().toISOString(),
      });
      removeTooltip();
      selection.removeAllRanges();
    });

    document.body.appendChild(tooltip);
  }, 10);
});

document.addEventListener('mousedown', (e) => {
  if (tooltip && !tooltip.contains(e.target)) {
    removeTooltip();
  }
});
