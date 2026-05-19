'use client';

import { useState } from 'react';
import Image from 'next/image';

interface IssueCoverProps {
  coverImage?: string;
  year?: string;
  issueNumber?: string;
  title?: string;
  className?: string;
}

export default function IssueCover({
  coverImage,
  year,
  issueNumber,
  title,
  className = '',
}: IssueCoverProps) {
  const [imgError, setImgError] = useState(false);
  const showImage =
    coverImage && !imgError && !coverImage.startsWith('data:image');

  if (showImage) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={coverImage}
          alt={title ? `VATAN ${title}` : `VATAN ${year} ${issueNumber}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <Placeholder year={year} issueNumber={issueNumber} className={className} />
  );
}

function Placeholder({
  year,
  issueNumber,
  className,
}: {
  year?: string;
  issueNumber?: string;
  className: string;
}) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white ${className}`}
    >
      <span className="text-xs uppercase tracking-wider mb-1">VATAN</span>
      {issueNumber && (
        <span className="text-2xl font-bold">{issueNumber}</span>
      )}
      {year && <span className="text-sm">{year}</span>}
    </div>
  );
}
