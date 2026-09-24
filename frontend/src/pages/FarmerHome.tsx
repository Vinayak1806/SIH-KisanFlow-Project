import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ticket, MapPin, BadgeIndianRupee, Clock, ArrowRight, 
  Sparkles, CheckCircle2, AlertCircle, ChevronRight, Activity, TrendingUp, Volume2, ShieldCheck, Sun 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api, TokenData } from '../services/api';
import { useRealtimeQueue } from '../hooks/useRealtimeQueue';

export const FarmerHome: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeToken, setActiveToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [voicePlaying, setVoicePlaying] = useState(false);

  const { lastEvent } = useRealtimeQueue(1, user?.userId);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const token = await api.getActiveToken();
      setActiveToken(token);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (lastEvent) {
      if (lastEvent.event === 'queue.updated' || lastEvent.event === 'token.stage_changed') {
        api.getActiveToken().then(setActiveToken);
      }
    }
  }, [lastEvent]);

  const handlePlayVoice = () => {
    setVoicePlaying(true);
    if ('speechSynthesis' in window) {
      const msgText = language === 'mr'
        ? "नमस्कार रामभाऊ. तुमचे टोकन क्रमांक के एफ २०२६-०००१२३ आहे. तुमचा रांगेतील क्रमांक बारा असून अंदाजे पंचवीस मिनिटांचा वेळ लागेल."
        : "Namaste Rajeshji. Your token KF-2026-000123 is at queue position 12 with an estimated wait time of 25 minutes.";
      
      const utterance = new SpeechSynthesisUtterance(msgText);
      utterance.rate = 0.9;
      utterance.onend = () => setVoicePlaying(false);
      utterance.onerror = () => setVoicePlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setVoicePlaying(false), 3000);
    }
  };

  const cropPrices = [
    { name: language === 'mr' ? 'गहू (Wheat)' : 'Wheat', price: '₹2,425', msp: 'MSP ₹2,425', trend: '+₹150 / Q' },
    { name: language === 'mr' ? 'कापूस (Cotton)' : 'Cotton', price: '₹7,100', msp: 'MSP ₹7,020', trend: '+₹80 / Q' },
    { name: language === 'mr' ? 'भात (Rice)' : 'Rice', price: '₹2,369', msp: 'MSP ₹2,369', trend: 'MSP Official' },
    { name: language === 'mr' ? 'सोयाबीन (Soybean)' : 'Soybean', price: '₹4,892', msp: 'MSP ₹4,892', trend: '+₹110 / Q' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
      
      {/* Top Greeting Header (Responsive) */}
      <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-gray-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-green-950 tracking-tight">
              {t('greeting')}, {user?.name ? user.name.split(' ')[0] : 'रामभाऊ'} 👋
            </h1>
            <span className="text-xs font-bold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
              FARM1001
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            {t('welcome_sub')} • District Pune, Maharashtra
          </p>
        </div>

        {/* Audio Speech Assistance & Yard Status */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Mandi Open: 08:00 AM – 06:00 PM</span>
          </div>

          <button
            onClick={handlePlayVoice}
            className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 shadow-xs active:scale-95 ${
              voicePlaying 
                ? 'bg-amber-500 text-white border-amber-600 animate-pulse' 
                : 'bg-white text-green-800 border-green-200 hover:bg-green-50'
            }`}
            title="बोलून ऐका (Listen Audio Status)"
          >
            <Volume2 className="w-5 h-5 stroke-[2.2]" />
            <span className="text-xs font-bold">
              {voicePlaying ? 'वाचत आहे...' : '🔊 ऐका (Voice Briefing)'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Main Stage & Actions) - 7 cols on desktop */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Hero Card: "Your Next Step" */}
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-green-900 mb-2 px-1 flex items-center justify-between">
              <span>{t('your_next_step')}</span>
              <span className="text-[10px] bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-bold">
                Real-Time APMC Yard Sync
              </span>
            </div>

            {activeToken ? (
              /* Active Token Hero Card */
              <div className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-token relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-9xl">
                  🌾
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full text-green-100">
                      Active Virtual Token
                    </span>
                    <div className="text-2xl sm:text-3xl font-black tracking-wider mt-1.5 text-white font-mono">
                      {activeToken.token_id}
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-xs sm:text-sm font-bold text-amber-300 block">
                      {activeToken.crop_name} • {activeToken.quantity} Quintals
                    </span>
                    <span className="text-xs text-green-200 block mt-0.5">
                      {activeToken.center_name}
                    </span>
                  </div>
                </div>

                {/* Live Queue Position & Wait Counter */}
                <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 my-4 text-center border border-white/15">
                  <div>
                    <div className="text-[10px] sm:text-xs text-green-200 uppercase font-bold">{t('queue_position')}</div>
                    <div className="text-3xl sm:text-4xl font-black text-amber-300">#{activeToken.queue_position || 12}</div>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs text-green-200 uppercase font-bold">{t('farmers_ahead')}</div>
                    <div className="text-3xl sm:text-4xl font-black text-white">{Math.max(0, (activeToken.queue_position || 12) - 1)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs text-green-200 uppercase font-bold">{t('est_wait')}</div>
                    <div className="text-3xl sm:text-4xl font-black text-green-300">{Math.round(activeToken.estimated_wait || 25)}m</div>
                  </div>
                </div>

                {/* Bottom Actions inside hero */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-green-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-semibold">{t('queue_updates_auto')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/token')}
                      className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-xs transition"
                    >
                      QR Pass
                    </button>
                    <button
                      onClick={() => navigate('/queue')}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-2 active:scale-95 transition"
                    >
                      <span>{t('view_queue')}</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* No Active Token: Prompt to Find Center */
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-green-200 shadow-soft text-left">
                <h2 className="text-lg font-extrabold text-gray-900">
                  {t('find_procurement_center')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Check real-time wait times, official prices, and book your hassle-free time slot.
                </p>
                <button
                  onClick={() => navigate('/centers')}
                  className="mt-5 py-3.5 px-6 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-sm shadow-soft flex items-center gap-2 active:scale-98 transition"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t('find_center_btn')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-gray-500 mb-3 px-1">
              {t('quick_actions')}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/book-slot')}
                className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white border border-green-100 hover:border-green-300 hover:shadow-soft text-gray-800 active:scale-95 transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Ticket className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold text-center leading-tight">
                  {t('action_token')}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">Book Slot</span>
              </button>

              <button
                onClick={() => navigate('/centers')}
                className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white border border-green-100 hover:border-green-300 hover:shadow-soft text-gray-800 active:scale-95 transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold text-center leading-tight">
                  {t('action_center')}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">6 Yards Nearby</span>
              </button>

              <button
                onClick={() => navigate('/recommendation')}
                className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white border border-green-100 hover:border-green-300 hover:shadow-soft text-gray-800 active:scale-95 transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold text-center leading-tight">
                  {t('recommended')}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">AI Best Choice</span>
              </button>

              <button
                onClick={() => navigate('/history')}
                className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white border border-green-100 hover:border-green-300 hover:shadow-soft text-gray-800 active:scale-95 transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold text-center leading-tight">
                  {t('action_history')}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">Past Sales</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (MSP Market Rates, Activity & Info) - 5 cols on desktop */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Today's Official Crop Prices (MSP) */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-extrabold text-green-950">
                  {t('today_crop_prices')}
                </h2>
                <p className="text-[11px] text-gray-500">Government Minimum Support Prices</p>
              </div>
              <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                Live MSP
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {cropPrices.map((crop) => (
                <div
                  key={crop.name}
                  className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 flex flex-col justify-between hover:bg-green-50/50 hover:border-green-200 transition"
                >
                  <div>
                    <span className="text-xs font-extrabold text-gray-900 block truncate">
                      {crop.name}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      {crop.msp}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-base font-black text-green-800">
                      {crop.price}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md">
                      / quintal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline Cards */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-extrabold text-green-950">
                {t('recent_activity')}
              </h2>
              <button onClick={() => navigate('/history')} className="text-xs text-green-700 font-bold hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-800 flex items-center justify-center shrink-0">
                    <Ticket className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">
                      {language === 'mr' ? 'टोकन तयार केले' : 'Token Booked'}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      KF-2026-000123 • Pune Center
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md">
                  Position #12
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <BadgeIndianRupee className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">
                      {language === 'mr' ? 'मागील खरेदी व पेमेंट जमा' : 'Procurement DBT Complete'}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      ₹83,905 • 34.6 Q Wheat
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md">
                  Paid ✓
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
