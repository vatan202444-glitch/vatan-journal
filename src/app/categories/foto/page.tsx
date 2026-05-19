'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Фото галерея маълумотлари
const photoGallery = [
  {
    id: 'photo-001',
    title: 'Тошкент шаҳри кўчалари',
    description: 'Замонавий Тошкентнинг гўзал кўчалари ва бинолари',
    imageUrl: '/images/gallery/tashkent-01.jpg',
    date: '2024-01-15',
    photographer: 'Алишер Назаров',
  },
  {
    id: 'photo-002',
    title: 'Ўзбекистон табиати',
    description: 'Кўксарой тоғларининг гўзал манзаралари',
    imageUrl: '/images/gallery/nature-01.jpg',
    date: '2024-02-10',
    photographer: 'Дилшод Раҳимов',
  },
  {
    id: 'photo-003',
    title: 'Маданий мерос',
    description: 'Ичан-қала қадимий шаҳарчасидан лавҳалар',
    imageUrl: '/images/gallery/ichan-kala.jpg',
    date: '2024-03-05',
    photographer: 'Саид Аҳмадов',
  },
  {
    id: 'photo-004',
    title: 'Миллий таомлар',
    description: 'Анъанавий ўзбек ошхонасидан лавҳалар',
    imageUrl: '/images/gallery/cuisine-01.jpg',
    date: '2024-03-20',
    photographer: 'Малика Умарова',
  },
  {
    id: 'photo-005',
    title: 'Санъат ва усталар',
    description: 'Ҳунармандларнинг қўл меҳнатидан лавҳалар',
    imageUrl: '/images/gallery/crafts-01.jpg',
    date: '2024-04-08',
    photographer: 'Баҳодир Хон',
  },
  {
    id: 'photo-006',
    title: 'Журнал тайёрлаш жараёни',
    description: '"VATAN" журнали чоп этиш жараёни',
    imageUrl: '/images/gallery/journal-01.jpg',
    date: '2024-04-25',
    photographer: 'Умар Иброҳимов',
  },
];

export default function PhotoCategory() {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photoGallery[0] | null>(null);

  return (
    <div className="min-h-screen bg-[#fcfbf7]">

      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            📷 Фото
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Ўзбекистоннинг гўзал манзаралари, маданий мероси ва журналимиз тайёрлаш жараёнига оид фотолавҳалар
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photoGallery.map((photo) => (
              <div
                key={photo.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] relative overflow-hidden">
                  {photo.imageUrl ? (
                    <Image
                      src={photo.imageUrl}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#94a3b8]">
                      <span className="text-6xl">📷</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1e293b] font-serif mb-2 group-hover:text-[#1e3a8a] transition-colors">
                    {photo.title}
                  </h3>
                  <p className="text-[#64748b] text-sm mb-4 line-clamp-2">
                    {photo.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                    <span>📅 {photo.date}</span>
                    <span>📷 {photo.photographer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="aspect-[16/9] bg-[#1e293b] relative">
                {selectedPhoto.imageUrl ? (
                  <Image
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.title}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#64748b]">
                    <span className="text-8xl">📷</span>
                  </div>
                )}
              </div>
              <div className="p-6 font-sans">
                <h3 className="text-2xl font-bold text-[#1e293b] font-serif mb-2">
                  {selectedPhoto.title}
                </h3>
                <p className="text-[#64748b] mb-4">{selectedPhoto.description}</p>
                <div className="flex items-center gap-6 text-sm text-[#94a3b8]">
                  <span>📅 {selectedPhoto.date}</span>
                  <span>📷 {selectedPhoto.photographer}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white text-4xl hover:text-[#fbbf24] transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
