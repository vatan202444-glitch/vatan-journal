'use client';

import { useState, useEffect } from 'react';

export default function ArticleTextSettings() {
  const [fontSize, setFontSize] = useState(100); // percentage

  useEffect(() => {
    // Apply font size to the article content wrapper
    const content = document.getElementById('article-content-body');
    if (content) {
      content.style.fontSize = `${fontSize}%`;
      content.style.lineHeight = fontSize > 100 ? '1.8' : '1.6';
    }
  }, [fontSize]);

  return (
    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
      <button 
        onClick={() => setFontSize(prev => Math.max(80, prev - 10))}
        title="Матнни кичрайтириш"
        className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <span className="text-sm font-medium">A-</span>
      </button>
      <div className="w-px h-4 bg-gray-200 mx-1"></div>
      <button 
        onClick={() => setFontSize(100)}
        title="Асл ҳолати"
        className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <span className="text-base font-medium">A</span>
      </button>
      <div className="w-px h-4 bg-gray-200 mx-1"></div>
      <button 
        onClick={() => setFontSize(prev => Math.min(150, prev + 10))}
        title="Матнни катталаштириш"
        className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <span className="text-lg font-medium">A+</span>
      </button>
    </div>
  );
}
