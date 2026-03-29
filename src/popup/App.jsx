import React, { useState, useEffect } from 'react';
import HighlightList from './components/HighlightList';
import SummaryPanel from './components/SummaryPanel';
import { getHighlights, deleteHighlight } from '../utils/storage';

const SUMMARY_ENABLED = import.meta.env.VITE_ENABLE_SUMMARY === 'true';

export default function App() {
  const [highlights, setHighlights] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const load = async () => {
    const data = await getHighlights();
    setHighlights(data);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await deleteHighlight(id);
    load();
  };

  return (
    <div className="w-[300px] h-[500px] flex flex-col bg-white relative overflow-hidden">
      <header className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-lg font-bold">✨ Highlightr</h1>
        <span className="text-xs bg-indigo-500 px-2 py-1 rounded-full">
          {highlights.length} saved
        </span>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col">
        <HighlightList highlights={highlights} onDelete={handleDelete} />
      </div>

      {SUMMARY_ENABLED && (
        <div className="border-t border-gray-200 p-2 flex-shrink-0">
          <button
            onClick={() => setShowSummary(true)}
            disabled={highlights.length === 0}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ✨ Summarize All
          </button>
        </div>
      )}

      {SUMMARY_ENABLED && showSummary && (
        <SummaryPanel highlights={highlights} onClose={() => setShowSummary(false)} />
      )}
    </div>
  );
}
