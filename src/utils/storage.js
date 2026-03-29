export const getHighlights = () =>
  chrome.storage.local.get('highlights').then(r => r.highlights || []);

export const saveHighlights = (highlights) =>
  chrome.storage.local.set({ highlights });

export const deleteHighlight = async (id) => {
  const all = await getHighlights();
  await saveHighlights(all.filter(h => h.id !== id));
};
