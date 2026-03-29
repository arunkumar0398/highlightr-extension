import React, { useState, useEffect } from 'react';

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function SummaryPanel({ highlights, onClose }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const texts = highlights.map((h, i) => `${i + 1}. "${h.text}"`).join('\n');
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Summarize the following saved highlights concisely in 3-5 bullet points.',
          },
          { role: 'user', content: texts },
        ],
      }),
    })
      .then(r => r.json())
      .then(data => {
        setSummary(data.choices?.[0]?.message?.content || 'No summary returned.');
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="absolute inset-0 bg-white flex flex-col z-10">
      <header className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
        <h2 className="font-bold">✨ AI Summary</h2>
        <button onClick={onClose} className="text-white hover:text-indigo-200 text-lg leading-none">✕</button>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span className="animate-spin">⟳</span> Generating summary…
          </div>
        )}
        {error && <p className="text-red-500 text-sm">Error: {error}</p>}
        {summary && (
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{summary}</div>
        )}
      </div>
    </div>
  );
}
