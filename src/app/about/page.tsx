import type { Metadata } from 'next';

import { readData } from '@/lib/storage';

export const metadata: Metadata = {
  title: 'Журнал ҳақида — VATAN',
  description: 'VATAN — Ўзбекистоннинг маънавий-маърифий, илмий-оммабоп журнали. Журнал тарихи, миссияси ва таҳрир ҳайъати.',
};

interface PageData { id: string; title: string; content: string; }

export default async function AboutPage() {
  const pages = readData<PageData[]>('pages.json', []);
  const aboutPage = pages.find(p => p.id === 'about');
  const hasDynamicContent = aboutPage && aboutPage.content && aboutPage.content.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-extrabold text-[#1e3a8a] font-serif mb-8 text-center">
          {aboutPage?.title || 'Журнал ҳақида'}
        </h1>

        {hasDynamicContent ? (
          <div 
            className="bg-white rounded-xl border border-[#e5e7eb] p-8 shadow-sm article-reading-body"
            dangerouslySetInnerHTML={{ __html: aboutPage.content }}
          />
        ) : (
          <div className="space-y-8">
            {/* Миссия */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1e293b] font-serif mb-4">🎯 Миссиямиз</h2>
              <p className="text-[#475569] leading-relaxed mb-4">
                <strong className="text-[#1e293b]">VATAN</strong> — маънавий-маърифий,
                илмий-оммабоп журнал. Ўзбекистоннинг маънавий қадриятларини, илмий
                тадқиқотларини ва маданий меросини ёритишга бағишланган.
              </p>
              <p className="text-[#475569] leading-relaxed">
                Журнал иқтисодий ислоҳот, жамият, тарих, маданият, тилшунослик ва
                бошқа соҳалардаги мақолаларни чоп этади. Ҳар бир мақола илмий
                далиллар ва тарихий манбаларга асосланган бўлиб, кенг аудиторияга
                тушунарли тилда ёзилган.
              </p>
            </div>

          {/* Таҳрир ҳайъати */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1e293b] font-serif mb-4">👥 Таҳрир ҳайъати</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-[#f8fafc] rounded-lg">
                <div className="w-12 h-12 bg-[#1e3a8a]/10 rounded-full flex items-center justify-center text-[#1e3a8a] font-bold text-lg shrink-0">Б</div>
                <div>
                  <p className="font-semibold text-[#1e293b]">Бош муҳаррир</p>
                  <p className="text-sm text-[#64748b]">Журнал мазмуни ва сифатини назорат қилиш</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-[#f8fafc] rounded-lg">
                <div className="w-12 h-12 bg-[#1e3a8a]/10 rounded-full flex items-center justify-center text-[#1e3a8a] font-bold text-lg shrink-0">И</div>
                <div>
                  <p className="font-semibold text-[#1e293b]">Илмий маслаҳатчи</p>
                  <p className="text-sm text-[#64748b]">Мақолаларнинг илмий сифатини тақриз қилиш</p>
                </div>
              </div>
            </div>
          </div>

          {/* Рукнлар */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1e293b] font-serif mb-4">📚 Асосий рукнлар</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '💼', name: 'Иқтисодиёт' },
                { icon: '🏛️', name: 'Тарих' },
                { icon: '👥', name: 'Жамият' },
                { icon: '🎭', name: 'Маданият' },
                { icon: '🗣️', name: 'Тилшунослик' },
                { icon: '📿', name: 'Маънавият' },
                { icon: '🔬', name: 'Илм' },
                { icon: '📚', name: 'Таълим' },
              ].map((cat) => (
                <div key={cat.name} className="text-center p-4 bg-[#f8fafc] rounded-lg border border-[#e5e7eb]">
                  <span className="text-2xl block mb-2">{cat.icon}</span>
                  <span className="text-sm font-medium text-[#475569]">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Мақола юбориш */}
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold font-serif mb-4">✍️ Мақола юбориш</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Журналимизга мақола юбориш орқали илмий ҳамжамиятга ўз ҳиссангизни қўшинг.
              Мақолалар таҳрир ҳайъати томонидан кўриб чиқилади.
            </p>
            <a
              href="mailto:info@vatanjournal.uz"
              className="inline-block bg-white text-[#1e3a8a] px-8 py-3 rounded-lg font-semibold hover:bg-[#f8fafc] transition-colors"
            >
              📧 info@vatanjournal.uz
            </a>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
