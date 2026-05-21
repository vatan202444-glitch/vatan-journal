'use client';

import React, { useState, useEffect } from 'react';

export default function ArticleActions({ articleTitle, shortLink }: { articleTitle: string, shortLink?: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(12);
  const [averageRating, setAverageRating] = useState('4.2');

  useEffect(() => {
    setTotalRatings(Math.floor(Math.random() * 50) + 10);
    setAverageRating((Math.random() * 2 + 3).toFixed(1));
  }, []);
  const [hasRated, setHasRated] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRate = (index: number) => {
    if (!hasRated) {
      setRating(index);
      setHasRated(true);
      setTotalRatings((prev) => prev + 1);
      // Mock new average
      setAverageRating(((parseFloat(averageRating) * totalRatings + index) / (totalRatings + 1)).toFixed(1));
    }
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = shortLink ? `${baseUrl}/${shortLink}` : (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="border-t border-b border-gray-200 py-8 mb-12 mt-8">
      {/* Rating Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 px-4">
        <div className="flex gap-12 text-center md:text-left w-full md:w-auto justify-center md:justify-start">
          <div>
            <div className="text-[#64748b] text-sm mb-1">Баҳолаганлар</div>
            <div className="text-xl font-bold text-[#1e293b]">{totalRatings}</div>
          </div>
          <div>
            <div className="text-[#64748b] text-sm mb-1">Рейтинг</div>
            <div className="text-xl font-bold text-[#1e293b]">{averageRating}</div>
          </div>
        </div>

        <div className="text-center md:text-right">
          <div className="text-[#64748b] text-sm mb-1">{hasRated ? 'Баҳоингиз учун раҳмат!' : 'Мақолага баҳо беринг'}</div>
          <div className="flex gap-1 justify-center md:justify-end">
            {[1, 2, 3, 4, 5].map((index) => {
              const isActive = index <= (hoverRating || rating);
              return (
                <button
                  key={index}
                  onClick={() => handleRate(index)}
                  onMouseEnter={() => !hasRated && setHoverRating(index)}
                  onMouseLeave={() => !hasRated && setHoverRating(0)}
                  disabled={hasRated}
                  className={`transition-colors ${hasRated ? 'cursor-default' : 'cursor-pointer hover:scale-110'} ${isActive ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-[#f1f5f9] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-200">
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-[#64748b] mb-1 uppercase tracking-wider">Мақолани улашинг</p>
          <h3 className="text-lg font-bold text-[#1e293b] leading-tight max-w-lg line-clamp-1">"{articleTitle}"</h3>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap justify-center md:justify-end items-center">
          {shortLink && (
            <div className="hidden lg:block">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-[#64748b] w-48 focus:outline-none"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
          )}
          <button
            onClick={handlePrint}
            title="Чоп этиш"
            className="flex items-center justify-center p-2.5 rounded-lg text-sm font-medium transition-colors bg-white hover:bg-gray-50 text-gray-600 shadow-sm border border-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          </button>
          <button
            onClick={handleCopy}
            title="Нусха олиш"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors bg-white hover:bg-gray-50 text-gray-600 shadow-sm border border-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
            <span className="hidden sm:inline">{copied ? 'Нусха олинди!' : 'Линк олиш'}</span>
          </button>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(articleTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors bg-[#0088cc] hover:bg-[#0077b3] text-white shadow-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Telegram
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors bg-[#1877f2] hover:bg-[#166fe5] text-white shadow-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
