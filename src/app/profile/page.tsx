'use client';

import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { user, loading, isPremium, logout, refreshUser } = useUser();
  const router = useRouter();
  const [payLoading, setPayLoading] = useState(false);
  const [showTariffs, setShowTariffs] = useState(false);
  const [paymentStep, setPaymentStep] = useState<{ show: boolean, plan: 'monthly' | 'yearly' | null }>({ show: false, plan: null });
  const [adminCard, setAdminCard] = useState({ cardNumber: '8600 **** **** ****', cardOwner: 'VATAN', bankName: 'Uzcard' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch('/api/payment-settings')
      .then(r => r.json())
      .then(data => setAdminCard(data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSelectPlan = (plan: 'monthly' | 'yearly') => {
    setPaymentStep({ show: true, plan });
    setShowTariffs(false);
  };

  const handleConfirmPay = async () => {
    if (!paymentStep.plan) return;
    setPayLoading(true);
    try {
      const res = await fetch('/api/user/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: paymentStep.plan }),
      });
      if (res.ok) {
        await refreshUser();
        setPaymentStep({ show: false, plan: null });
        alert('Муваффақиятли тўлов амалга оширилди! Энди сиз Premium обуначисиз.');
      } else {
        alert('Тўловда хатолик юз берди.');
      }
    } catch {
      alert('Тармоқда хатолик');
    } finally {
      setPayLoading(false);
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-[#64748b]">Юкланмоқда...</div>;
  }

  const expiryDate = user.premiumUntil ? new Date(user.premiumUntil).toLocaleDateString('uz-UZ') : null;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#1e3a8a] to-blue-500 rounded-full flex items-center justify-center text-4xl text-white font-bold mx-auto mb-4 uppercase">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-[#1e293b] mb-1">{user.name}</h2>
              <p className="text-[#64748b] text-sm mb-6">{user.phone}</p>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                isPremium ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {isPremium ? '🌟 Premium Обуначи' : 'Бепул фойдаланувчи'}
              </div>

              <div className="border-t border-[#e5e7eb] pt-6 mt-2">
                <button onClick={handleLogout} className="text-red-500 font-medium hover:text-red-700 transition-colors flex items-center justify-center gap-2 w-full">
                  <span>🚪</span> Тизимдан чиқиш
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-2/3 space-y-6">
            
            {/* Subscription Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-8 relative overflow-hidden">
              {isPremium && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400 opacity-10 rounded-bl-full -mr-4 -mt-4" />
              )}
              
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">Обуна ҳолати</h3>
              
              {isPremium ? (
                <div>
                  <p className="text-[#64748b] mb-4">Сизнинг Premium обунангиз фаол. Барча пуллик мақолаларни ва архив сонларни чекловисиз ўқишингиз мумкин.</p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Тугаш санаси</p>
                      <p className="text-lg font-bold text-amber-800">{expiryDate}</p>
                    </div>
                    <button onClick={() => setShowTariffs(true)} className="bg-amber-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors">
                      Узайтириш
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-[#64748b] mb-6">Сизда ҳозирча Premium обуна йўқ. Фақат бепул мақолаларни ўқишингиз мумкин.</p>
                  <button onClick={() => setShowTariffs(true)} className="bg-[#1e3a8a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors inline-flex items-center gap-2 shadow-md">
                    <span className="text-xl">🌟</span> Premium сотиб олиш
                  </button>
                </div>
              )}
            </div>

            {/* Tariffs Section */}
            {showTariffs && !paymentStep.show && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-8 border-t-4 border-t-[#1e3a8a]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#1e293b] font-serif">Тарифни танланг</h3>
                  <button onClick={() => setShowTariffs(false)} className="text-[#64748b] hover:text-red-500 text-xl">✕</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-2 border-[#e5e7eb] rounded-xl p-6 hover:border-[#1e3a8a] transition-colors cursor-pointer relative group">
                    <div className="absolute top-0 right-0 bg-[#f8fafc] text-xs font-bold text-[#64748b] px-3 py-1 rounded-bl-lg rounded-tr-lg">1 ой</div>
                    <h4 className="text-lg font-bold text-[#1e293b] mb-2">Ойлик обуна</h4>
                    <p className="text-3xl font-bold text-[#1e3a8a] mb-4">15 000 <span className="text-base text-[#64748b] font-normal">сўм</span></p>
                    <ul className="text-sm text-[#64748b] space-y-2 mb-6">
                      <li>✓ Барча мақолалар</li>
                      <li>✓ Архив журналлар</li>
                      <li>✓ Рекламасиз ўқиш</li>
                    </ul>
                    <button 
                      onClick={() => handleSelectPlan('monthly')} 
                      className="w-full bg-[#f8fafc] text-[#1e3a8a] font-semibold py-2 rounded-lg group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors border border-[#1e3a8a]"
                    >
                      Сотиб олиш
                    </button>
                  </div>

                  <div className="border-2 border-amber-500 rounded-xl p-6 relative group bg-amber-50/30">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Энг машҳур</div>
                    <div className="absolute top-0 right-0 bg-amber-100 text-xs font-bold text-amber-700 px-3 py-1 rounded-bl-lg rounded-tr-lg">1 йил</div>
                    <h4 className="text-lg font-bold text-[#1e293b] mb-2">Йиллик обуна</h4>
                    <p className="text-3xl font-bold text-amber-600 mb-4">150 000 <span className="text-base text-[#64748b] font-normal">сўм</span></p>
                    <ul className="text-sm text-[#64748b] space-y-2 mb-6">
                      <li>✓ Барча мақолалар</li>
                      <li>✓ Архив журналлар</li>
                      <li>✓ Рекламасиз ўқиш</li>
                      <li className="text-amber-600 font-semibold">🎁 2 ой текин</li>
                    </ul>
                    <button 
                      onClick={() => handleSelectPlan('yearly')}
                      className="w-full bg-amber-500 text-white font-semibold py-2 rounded-lg hover:bg-amber-600 transition-colors shadow-md"
                    >
                      Сотиб олиш
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Modal (QR Code) */}
            {paymentStep.show && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-8 border-t-4 border-t-green-500">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#1e293b] font-serif">Тўловни амалга ошириш</h3>
                  <button onClick={() => setPaymentStep({ show: false, plan: null })} className="text-[#64748b] hover:text-red-500 text-xl">✕</button>
                </div>

                <div className="text-center">
                  <p className="text-[#64748b] mb-6">Қуйидаги QR код орқали ёки карта рақамига тўловни амалга оширинг.</p>
                  
                  {/* QR Code Placeholder */}
                  <div className="w-48 h-48 mx-auto bg-white border-4 border-gray-100 rounded-xl flex items-center justify-center p-2 mb-6 shadow-sm">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(adminCard.cardNumber)}`} alt="QR Code" className="w-full h-full object-contain" />
                  </div>

                  {/* Card Info */}
                  <div className="bg-[#f8fafc] border border-[#e5e7eb] rounded-xl p-4 max-w-sm mx-auto mb-8">
                    <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Тўлов суммаси</p>
                    <p className="text-2xl font-bold text-green-600 mb-4">{paymentStep.plan === 'yearly' ? '150 000' : '15 000'} сўм</p>
                    
                    <div className="h-px bg-[#e5e7eb] w-full my-3" />
                    
                    <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Карта рақами ({adminCard.bankName})</p>
                    <p className="text-xl font-mono text-[#1e293b] tracking-widest">{adminCard.cardNumber}</p>
                    <p className="text-sm font-semibold text-[#64748b] mt-1">{adminCard.cardOwner}</p>
                  </div>

                  <button 
                    onClick={handleConfirmPay}
                    disabled={payLoading}
                    className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 text-lg w-full max-w-sm mx-auto disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {payLoading ? 'Текширилмоқда...' : '✅ Тўловни амалга оширдим'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
