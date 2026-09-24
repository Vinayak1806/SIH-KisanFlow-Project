import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Clock, ArrowDown, Bell, CheckCircle2, ChevronRight, 
  Volume2, ShieldAlert, Sparkles, RefreshCw, ArrowRight 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api, TokenData } from '../services/api';
import { useRealtimeQueue } from '../hooks/useRealtimeQueue';

export const LiveQueue: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [position, setPosition] = useState<number>(12);
  const [prevPosition, setPrevPosition] = useState<number | null>(null);
  const [waitMinutes, setWaitMinutes] = useState<number>(25);
  const [token, setToken] = useState<TokenData | null>(null);
  const [showPositionAlert, setShowPositionAlert] = useState(false);

  const { lastEvent } = useRealtimeQueue(1, user?.userId);

  useEffect(() => {
    api.getActiveToken().then((tok) => {
      if (tok) {
        setToken(tok);
        if (tok.queue_position) {
          setPosition(tok.queue_position);
          setWaitMinutes(Math.round(tok.estimated_wait || 25));
        }
      }
    });
  }, []);

  useEffect(() => {
    if (lastEvent?.event === 'queue.updated') {
      api.getActiveToken().then((tok) => {
        if (tok && tok.queue_position && tok.queue_position !== position) {
          setPrevPosition(position);
          setPosition(tok.queue_position);
          setWaitMinutes(Math.round(tok.estimated_wait || 22));
          setShowPositionAlert(true);
          setTimeout(() => setShowPositionAlert(false), 5000);
        }
      });
    }
  }, [lastEvent, position]);

  const handleSimulateAdvance = () => {
    setPrevPosition(position);
    const newPos = Math.max(1, position - 1);
    setPosition(newPos);
    setWaitMinutes(Math.max(5, waitMinutes - 3));
    setShowPositionAlert(true);
    setTimeout(() => setShowPositionAlert(false), 4000);
  };

  const counters = [
    { num: 1, stage: "Weighing / वजन काटा", status: "Active", serving: "KF-2026-000110", badge: "bg-emerald-100 text-emerald-800" },
    { num: 2, stage: "Verification / कागदपत्रे", status: "Active", serving: "KF-2026-000111", badge: "bg-blue-100 text-blue-800" },
    { num: 3, stage: "Procurement / खरेदी", status: "Active", serving: "KF-2026-000114", badge: "bg-purple-100 text-purple-800" },
    { num: 4, stage: "Weighing / वजन काटा", status: "Active", serving: "KF-2026-000116", badge: "bg-emerald-100 text-emerald-800" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
      
      {/* Header with Simulate Advance Button */}
      <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-gray-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-green-950 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span>{t('live_queue')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {language === 'mr' 
              ? 'पुणे कृषी उत्पन्न बाजार समिती • थेट स्वयंचलित रांग' 
              : language === 'hi'
              ? 'पुणे कृषि उपज मंडी • लाइव स्वचालित कतार'
              : 'Pune Agriculture Procurement Center Yard • Real-Time Automated Queue Sync'}
          </p>
        </div>

        {/* Simulation Trigger */}
        <button
          onClick={handleSimulateAdvance}
          className="px-4 py-2.5 rounded-2xl bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 hover:bg-amber-200 active:scale-95 transition flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-center"
          title="Simulate Queue Movement for Evaluation"
        >
          <RefreshCw className="w-4 h-4 text-amber-700 animate-spin" />
          <span>{language === 'mr' ? 'रांग पुढे सरकवा (#१२ ➔ #११)' : language === 'hi' ? 'कतार आगे बढ़ाएं (#12 ➔ #11)' : 'Advance Queue (#12 ➔ #11)'}</span>
        </button>
      </div>

      {/* Position Change Alert Card */}
      {showPositionAlert && prevPosition && (
        <div className="p-4 mb-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-3xl shadow-soft flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-white animate-bounce shrink-0" />
            <div>
              <div className="text-sm font-black">
                {language === 'mr' ? 'तुमची पाळी पुढे सरकली आहे!' : language === 'hi' ? 'आपकी बारी आगे बढ़ गई है!' : 'Your position changed!'}
              </div>
              <div className="text-xs font-semibold opacity-90 mt-0.5">
                #{prevPosition} ➔ #{position} ({waitMinutes} {language === 'mr' ? 'मिनिटे शिल्लक' : language === 'hi' ? 'मिनट शेष' : 'min remaining'})
              </div>
            </div>
          </div>
          <span className="text-xs font-black bg-white/25 px-3 py-1 rounded-xl">Live Sync</span>
        </div>
      )}

      {/* Responsive 2-Column Grid on Tablet/Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Big Position Card (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-green-700/60 shadow-token text-center relative overflow-hidden">
          <div className="text-xs font-extrabold uppercase tracking-widest text-green-800">
            {language === 'mr' ? 'तुमचा सध्याचा रांगेतील क्रमांक' : language === 'hi' ? 'आपका वर्तमान कतार क्रमांक' : 'Your Current Turn Number'}
          </div>

          {/* Animated Big Number */}
          <div className="text-7xl sm:text-8xl font-black text-green-950 my-3 tracking-tight transition-all transform scale-105">
            {position}
          </div>

          <div className="text-sm font-bold text-gray-600">
            {Math.max(0, position - 1)} {t('farmers_ahead')} {language === 'mr' ? 'डिजिटल रांगेत' : language === 'hi' ? 'डिजिटल लाइन में' : 'in virtual line'}
          </div>

          {/* Wait time progress pill */}
          <div className="my-5 p-4 bg-green-50 rounded-2xl border border-green-200 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-green-700" />
              <span className="font-bold text-gray-700">
                {language === 'mr' ? 'एआय-अंदाजित प्रतीक्षा वेळ' : language === 'hi' ? 'एआई-अनुमानित प्रतीक्षा समय' : 'AI-Estimated Waiting Time'}
              </span>
            </div>
            <span className="font-black text-green-900 text-base sm:text-lg">
              {waitMinutes} {language === 'mr' ? 'मिनिटे' : language === 'hi' ? 'मिनट' : 'minutes'}
            </span>
          </div>

          {/* Visual Queue Stepper: Ahead -> You */}
          <div className="py-2">
            <div className="text-[10px] uppercase font-bold text-gray-400 mb-3">
              {language === 'mr' ? 'थेट बाजार यार्ड प्रवाह' : language === 'hi' ? 'लाइव मंडी यार्ड प्रवाह' : 'Live Yard Progression'}
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold overflow-x-auto py-1">
              <span className="px-2.5 py-1.5 bg-gray-100 rounded-xl text-gray-500">#{position + 2}</span>
              <span className="text-gray-300">➔</span>
              <span className="px-2.5 py-1.5 bg-gray-100 rounded-xl text-gray-500">#{position + 1}</span>
              <span className="text-gray-300">➔</span>
              <span className="px-4 py-2 bg-green-700 text-white rounded-2xl shadow-xs ring-4 ring-green-100 font-black text-sm scale-110">
                #{position} ({language === 'mr' ? 'तुम्ही' : language === 'hi' ? 'आप' : 'You'})
              </span>
              <span className="text-gray-300">➔</span>
              <span className="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-xl font-bold">
                {language === 'mr' ? 'काउंटर' : language === 'hi' ? 'काउंटर' : 'Counter'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Active Counters & Next Step (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 4 Active Counters Live Status */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase font-extrabold tracking-wider text-gray-600">
                {language === 'mr' ? 'कार्यरत बाजार समिती काउंटर्स (४ सक्रिय)' : language === 'hi' ? 'कार्यरत मंडी काउंटर्स (4 सक्रिय)' : 'Operational APMC Counters (4 Active)'}
              </h2>
              <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                {language === 'mr' ? 'गेट व यार्ड सिंक' : language === 'hi' ? 'गेट व यार्ड सिंक' : 'Gate & Yard Synced'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {counters.map((c) => (
                <div
                  key={c.num}
                  className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-black text-green-950">
                      {language === 'mr' ? 'काउंटर' : language === 'hi' ? 'काउंटर' : 'Counter'} {c.num}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${c.badge}`}>
                      {language === 'mr' ? 'सक्रिय' : language === 'hi' ? 'सक्रिय' : c.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-gray-700">{c.stage}</div>
                  <div className="text-[11px] text-gray-500 mt-2 font-mono">
                    {language === 'mr' ? 'सुरू टोकन:' : language === 'hi' ? 'जारी टोकन:' : 'Serving:'} <span className="font-bold text-gray-800">{c.serving}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Step CTA */}
          <button
            onClick={() => navigate('/weighing')}
            className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm sm:text-base shadow-soft-lg flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <span>{language === 'mr' ? 'वजन काटा टप्प्यावर जा' : language === 'hi' ? 'तौल कांटा चरण पर जाएं' : 'Proceed to Weighing Stage'}</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>

        </div>

      </div>

    </div>
  );
};
