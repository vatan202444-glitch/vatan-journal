'use client';


export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fcfbf7] py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-extrabold text-[#1e3a8a] font-serif mb-8 text-center">
          Алоқа
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1e293b] font-serif mb-4">📬 Боғланиш маълумотлари</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold text-[#1e293b]">Email</p>
                    <a href="mailto:info@vatanjournal.uz" className="text-[#1e3a8a] hover:underline">
                      info@vatanjournal.uz
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-semibold text-[#1e293b]">Telegram</p>
                    <a
                      href="https://t.me/vatanjournal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1e3a8a] hover:underline"
                    >
                      @vatanjournal
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-[#1e293b]">Манзил</p>
                    <p className="text-[#64748b]">Тошкент шаҳри, Ўзбекистон</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-[#1e3a8a] mb-2">📝 Мақола юборишнинг қоидалари</h3>
              <ul className="text-sm text-[#475569] space-y-2 list-disc list-inside">
                <li>Мақола ўзбек тилида ёзилган бўлиши керак</li>
                <li>Ҳажми 2000-5000 сўз атрофида бўлиши тавсия этилади</li>
                <li>Илмий тадқиқот мақолалари манбалар рўйхатини ўз ичига олиши керак</li>
                <li>Мақола бошқа нашрда чоп этилмаган бўлиши шарт</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1e293b] font-serif mb-4">✉️ Хабар юбориш</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Исмингиз</label>
                <input
                  type="text"
                  placeholder="Исм Фамилия"
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Мавзу</label>
                <select className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] transition-colors">
                  <option value="">Танланг...</option>
                  <option value="article">Мақола юбориш</option>
                  <option value="collaboration">Ҳамкорлик</option>
                  <option value="feedback">Фикр-мулоҳаза</option>
                  <option value="other">Бошқа</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Хабар</label>
                <textarea
                  placeholder="Хабарингизни ёзинг..."
                  rows={5}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
              >
                Юбориш
              </button>
              <p className="text-xs text-[#94a3b8] text-center">
                Хабарингиз таҳририят электрон почтасига юборилади
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
