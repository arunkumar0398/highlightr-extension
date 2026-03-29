import React from 'react';

export default function HighlightCard({ highlight, onDelete }) {
  const { id, text, url, pageTitle, savedAt } = highlight;
  const date = new Date(savedAt).toLocaleDateString();
  const truncated = text.length > 120 ? text.slice(0, 120) + '…' : text;
  const hostname = (() => {
    try { return new URL(url).hostname; } catch { return url; }
  })();

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
      <p className="text-gray-800 mb-2 leading-snug">{truncated}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex flex-col gap-0.5 min-w-0">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-500 hover:underline truncate max-w-[180px]"
          >
            {pageTitle || hostname}
          </a>
          <span>{date}</span>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="text-red-400 hover:text-red-600 font-bold px-2 py-1 flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
