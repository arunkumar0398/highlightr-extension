import React from 'react';
import HighlightCard from './HighlightCard';

export default function HighlightList({ highlights, onDelete }) {
  if (highlights.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm p-4 text-center">
        <div>
          <p className="text-2xl mb-2">📄</p>
          <p>Select text on any page to save highlights</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {highlights.map(h => (
        <HighlightCard key={h.id} highlight={h} onDelete={onDelete} />
      ))}
    </div>
  );
}
