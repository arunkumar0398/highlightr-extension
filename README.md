# Highlightr — Chrome Extension

> Highlight any text on any webpage and save it locally in your browser. Clean popup UI, instant delete, and optional AI-powered summarization.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Build](#build)
  - [Load in Chrome](#load-in-chrome)
- [Environment Variables](#environment-variables)
- [How It Works](#how-it-works)
  - [Saving a Highlight](#saving-a-highlight)
  - [Viewing Highlights](#viewing-highlights)
  - [Deleting a Highlight](#deleting-a-highlight)
  - [AI Summarize (Optional)](#ai-summarize-optional)
- [Data Shape](#data-shape)
- [File Reference](#file-reference)
- [Scripts](#scripts)

---

## Overview

**Highlightr** is a Manifest V3 Chrome extension that lets you select text on any webpage and save it with one click. All highlights are stored locally using `chrome.storage.local` — nothing leaves your browser unless you use the optional AI summarize feature.

Clicking the extension icon in the Chrome toolbar opens a 300×500px popup showing a scrollable list of all your saved highlights, each with the page title, source URL, and date saved. You can delete individual highlights at any time.

---

## Features

| Feature | Description |
|---|---|
| **Save Highlight** | Select any text on any page — a floating tooltip appears. Click it to save. |
| **Popup List** | Click the extension icon to see all saved highlights in a scrollable list. |
| **Page Metadata** | Each highlight stores the page title, source URL, and timestamp. |
| **Delete** | Remove any highlight instantly with the ✕ button on each card. |
| **Empty State** | Friendly prompt shown when no highlights are saved yet. |
| **AI Summarize** *(optional)* | Sends all highlights to OpenAI `gpt-4o-mini` and returns 3–5 bullet point summary. Gated behind an env flag. |
| **Local Storage** | All data lives in `chrome.storage.local` — private, fast, no backend needed. |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Extension Framework | Manifest V3 (Chrome) |
| Popup UI | React 18 + Vite 5 |
| Styling | Tailwind CSS v3 |
| Storage | `chrome.storage.local` |
| AI Summary *(optional)* | OpenAI `gpt-4o-mini` via `fetch` |
| Build Output | `dist/` → loaded as unpacked extension |
| Icon Generation | `pngjs` via custom Node script |

---

## Project Structure

```
highlightr-extension/
├── public/
│   ├── manifest.json          # Chrome Extension Manifest V3 config
│   ├── content.css            # Styles for the floating tooltip (injected into pages)
│   └── icons/
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── src/
│   ├── content/
│   │   └── content.js         # Injected into every webpage — handles selection & tooltip
│   ├── background/
│   │   └── background.js      # Service worker — listens for messages, writes to storage
│   ├── popup/
│   │   ├── main.jsx           # React entry point
│   │   ├── App.jsx            # Root component — loads highlights, controls summary panel
│   │   ├── index.css          # Tailwind base styles for popup
│   │   └── components/
│   │       ├── HighlightList.jsx   # Scrollable list or empty state
│   │       ├── HighlightCard.jsx   # Individual highlight card with delete button
│   │       └── SummaryPanel.jsx    # AI summary overlay (shown when VITE_ENABLE_SUMMARY=true)
│   └── utils/
│       └── storage.js         # chrome.storage.local helper functions
├── scripts/
│   └── create-icons.cjs       # Generates PNG icons using pngjs
├── popup.html                 # HTML shell for the React popup
├── vite.config.js             # Multi-entry Vite build config
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── .env                       # Local environment variables (git-ignored)
├── .gitignore
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- Google Chrome browser

### Installation

```bash
# Clone the repository
git clone https://github.com/arunkumar0398/highlightr-extension.git
cd highlightr-extension

# Install dependencies
npm install
```

### Build

```bash
npm run build
```

This compiles everything into the `dist/` folder using Vite with three entry points — `popup`, `content`, and `background`.

### Load in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Toggle **Developer Mode** on (top-right corner)
3. Click **Load unpacked**
4. Select the `dist/` folder inside the project directory
5. The **Highlightr** icon will appear in your Chrome toolbar

> After any code change, run `npm run build` again and click the **reload** icon on the extension card in `chrome://extensions`.

---

## Environment Variables

Create a `.env` file at the project root (already gitignored):

```env
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
VITE_ENABLE_SUMMARY=false
```

| Variable | Default | Description |
|---|---|---|
| `VITE_OPENAI_API_KEY` | *(empty)* | Your OpenAI API key. Required only if summary is enabled. |
| `VITE_ENABLE_SUMMARY` | `false` | Set to `true` to show the **✨ Summarize All** button in the popup. |

> The `VITE_ENABLE_SUMMARY` flag controls whether the summarize button and panel are rendered at all. When set to `false`, no OpenAI calls are made and the button is hidden entirely.

---

## How It Works

### Saving a Highlight

1. Visit any webpage in Chrome.
2. Select any text with your mouse.
3. A small dark tooltip — **💾 Save Highlight** — appears near your cursor.
4. Click the tooltip.
5. The highlight is sent via `chrome.runtime.sendMessage` to the background service worker.
6. The service worker appends it (with a UUID, URL, page title, and timestamp) to `chrome.storage.local`.

```
User selects text
      ↓
content.js detects mouseup → renders tooltip
      ↓
User clicks tooltip
      ↓
chrome.runtime.sendMessage({ type: 'SAVE_HIGHLIGHT', ... })
      ↓
background.js receives message → appends to chrome.storage.local
```

### Viewing Highlights

1. Click the **Highlightr** icon in the Chrome toolbar.
2. The React popup opens at 300×500px.
3. On mount, `App.jsx` calls `getHighlights()` from `storage.js` which reads `chrome.storage.local`.
4. All highlights are rendered as `<HighlightCard />` components in a scrollable list.
5. Each card displays:
   - Truncated text snippet (up to 120 characters)
   - Page title (linked to source URL)
   - Date saved

### Deleting a Highlight

1. Click the **✕** button on any highlight card.
2. `deleteHighlight(id)` filters that item out of storage and saves the updated array.
3. The list re-renders immediately.

### AI Summarize (Optional) - (Still in development)

> Only available when `VITE_ENABLE_SUMMARY=true` in `.env` and a valid `VITE_OPENAI_API_KEY` is set.

1. Click **✨ Summarize All** at the bottom of the popup.
2. `SummaryPanel.jsx` mounts as a full overlay.
3. All saved highlight texts are formatted and sent to:
   ```
   POST https://api.openai.com/v1/chat/completions
   Model: gpt-4o-mini
   System: "Summarize the following saved highlights concisely in 3-5 bullet points."
   ```
4. The response is displayed as formatted text inside the overlay.
5. Close the panel with the **✕** button to return to the highlights list.

---

## Data Shape

Each saved highlight is stored as an object in a `highlights` array inside `chrome.storage.local`:

```js
{
  id: "3f2a1b4c-...",            // crypto.randomUUID()
  text: "The highlighted text",  // Raw selected string
  url: "https://example.com/",  // Full page URL
  pageTitle: "Article Title",   // document.title at time of save
  savedAt: "2026-03-29T10:00:00.000Z"  // ISO timestamp
}
```

---

## File Reference

| File | Purpose |
|---|---|
| `public/manifest.json` | Declares permissions, content scripts, background worker, popup, and icons |
| `public/content.css` | Fixed-position dark tooltip injected into every page |
| `src/content/content.js` | Listens for `mouseup`, renders tooltip, sends `SAVE_HIGHLIGHT` message |
| `src/background/background.js` | Receives `SAVE_HIGHLIGHT`, reads/writes `chrome.storage.local` |
| `src/utils/storage.js` | `getHighlights`, `saveHighlights`, `deleteHighlight` — async storage helpers |
| `src/popup/main.jsx` | Mounts the React app into `popup.html#root` |
| `src/popup/App.jsx` | Root component — state management, layout, summary flag gate |
| `src/popup/components/HighlightList.jsx` | Maps highlights to cards or shows empty state |
| `src/popup/components/HighlightCard.jsx` | Renders one highlight with snippet, metadata, and delete button |
| `src/popup/components/SummaryPanel.jsx` | Full-overlay OpenAI summary panel |
| `vite.config.js` | Multi-entry build — `popup`, `content`, `background` → `dist/` |
| `scripts/create-icons.cjs` | Node script to generate `icon16/48/128.png` using `pngjs` |

---

## Scripts

```bash
npm run build          # Production build → dist/
npm run dev            # Vite dev server (for popup UI development only)
npm run create-icons   # Regenerate extension icons
```

---

> Built with React, Vite, Tailwind CSS, and Chrome Extension Manifest V3.
