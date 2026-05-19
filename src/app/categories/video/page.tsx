'use client';

import { useState } from 'react';
import Image from 'next/image';

// Видео галерея маълумотлари
const videoGallery = [
  {
    id: 'video-001',
    title: '"VATAN" журнали тақдимоти',
    description: 'Журналнинг расмий тақдимоти ва маҳсус лойиҳалар',
    thumbnail: '/images/video/journal-presentation.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    duration: '12:35',
    date: '2024-01-20',
  },
  {
    id: 'video-002',
    title: 'Муаллиф билан суҳбат: Дилшод Раҳимов',
    description: 'Иқтисодчи-муаллиф билан мукаммал интервью',
    thumbnail: '/images/video/interview-rahimov.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    duration: '25:18',
    date: '2024-02-15',
  },
  {
    id: 'video-003',
    title: 'Ўзбекистон табиати - 4K',
    description: 'Кўксарой тоғлари ва Чимган водийлари гўзаллиги',
    thumbnail: '/images/video/nature-uzbekistan.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    duration: '08:42',
    date: '2024-03-10',
  },
  {
    id: 'video-004',
    title: 'Китоб тақдимоти: "Ўзбекчилик"',
    description: 'Монография тақдимоти ва дискуссия',
    thumbnail: '/images/video/book-presentation.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    duration: '45:20',
    date: '2024-03-25',
  },
  {
    id: 'video-005',
    title: 'Маданий мерос: Ичан-қала',
    description: 'Хива шаҳарчасининг тарихий лавҳалари',
    thumbnail: '/images/video/ichan-kala.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example5',
    duration: '15:55',
    date: '2024-04-12',
  },
  {
    id: 'video-006',
    title: 'Журнал чоп этиш жараёни',
    description: '"VATAN" журнали чоп этиш технологияси',
    thumbnail: '/images/video/printing-process.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example6',
    duration: '06:30',
    date: '2024-04-28',
  },
  {
    id: 'video-007',
    title: 'Анъанавий ҳунарлар',
    description: 'Қўлғоплар, кулолчилик ва бошқа ҳунармандчилик',
    thumbnail: '/images/video/crafts.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example7',
    duration: '18:15',
    date: '2024-05-05',
  },
  {
    id: 'video-008',
    title: 'Тарихий ҳужжатлар',
    description: 'Архивдан табилган қизиқарли тарихий лавҳалар',
    thumbnail: '/images/video/historical.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example8',
    duration: '22:40',
    date: '2024-05-18',
  },
];

export default function VideoCategory() {
  const [selectedVideo, setSelectedVideo] = useState<typeof videoGallery[0] | null>(null);

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#b45309] to-[#92400e] py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            🎬 Видео
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Журналимизга оид видео лавҳалар, интервьюлар, тақдимотлар ва ҳужжатли фильмлар
          </p>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoGallery.map((video) => (
              <div
                key={video.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="aspect-video bg-gradient-to-br from-[#1e293b] to-[#334155] relative overflow-hidden">
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#64748b]">
                      <span className="text-6xl">🎬</span>
                    </div>
                  )}
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#dc2626] group-hover:scale-110 transition-all duration-300">
                      <span className="text-3xl text-white ml-1">▶</span>
                    </div>
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1e293b] font-serif mb-2 group-hover:text-[#b45309] transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-[#64748b] text-sm mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                    <span>📅 {video.date}</span>
                    <span className="text-[#b45309] font-medium">Батафсил →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#1e293b] rounded-xl overflow-hidden">
              {/* Video Player Placeholder */}
              <div className="aspect-video bg-black flex items-center justify-center relative">
                <div className="text-center">
                  <span className="text-8xl mb-4 block">🎬</span>
                  <p className="text-white/60">Видео плеер</p>
                  <a
                    href={selectedVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-6 py-3 bg-[#dc2626] text-white rounded-lg hover:bg-[#b91c1c] transition-colors"
                  >
                    ▶ YouTube'да кўриш
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white font-serif mb-2">
                  {selectedVideo.title}
                </h3>
                <p className="text-[#94a3b8] mb-4">{selectedVideo.description}</p>
                <div className="flex items-center gap-6 text-sm text-[#64748b]">
                  <span>📅 {selectedVideo.date}</span>
                  <span>⏱ {selectedVideo.duration}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
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
