import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, Users, ArrowRight, Star, Navigation, 
  Search, ShieldCheck, Filter, ChevronRight, Sparkles 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api, CenterData } from '../services/api';

export const FindCenter: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [centers, setCenters] = useState<CenterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await api.getCenters(18.5204, 73.8567);
      setCenters(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredCenters = centers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
      
      {/* Top Header & Search Bar */}
      <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-gray-200/80 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-green-950 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-green-700" />
            <span>{t('nearby_centers')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {language === 'mr' 
              ? 'थेट प्रतीक्षा वेळ व हमीभाव तपासून केंद्र निवडा' 
              : language === 'hi' 
              ? 'लाइव प्रतीक्षा समय और एमएसपी दरें देखकर केंद्र चुनें' 
              : 'Compare live queues, active counters, and official MSP prices'}
          </p>
        </div>

        {/* Search & Location Bar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'mr' ? 'केंद्राचे नाव किंवा जिल्हा शोधा...' : language === 'hi' ? 'केंद्र का नाम या जिला खोजें...' : 'Search center or district...'}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-xs"
            />
          </div>

          <button
            onClick={() => navigate('/recommendation')}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-950 text-xs font-black shrink-0 flex items-center gap-1.5 shadow-xs transition active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-900" />
            <span className="hidden sm:inline">
              {language === 'mr' ? 'एआय शिफारस' : language === 'hi' ? 'एआई सिफारिश' : 'AI Recommendation'}
            </span>
            <span className="sm:hidden">AI Best</span>
          </button>
        </div>
      </div>

      {/* GPS Location Strip */}
      <div className="mb-6 p-4 bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl text-white shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Navigation className="w-5 h-5 text-emerald-300 animate-pulse" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold">
              {language === 'mr' ? 'जीपीएस स्थान: जिल्हा पुणे, महाराष्ट्र' : language === 'hi' ? 'जीपीएस स्थान: जिला पुणे, महाराष्ट्र' : 'GPS Location: District Pune, Maharashtra'}
            </div>
            <div className="text-[11px] text-emerald-200">
              {language === 'mr' ? `${filteredCenters.length} थेट कार्यरत शासकीय खरेदी केंद्रे उपलब्ध` : language === 'hi' ? `${filteredCenters.length} सक्रिय सरकारी खरीद केंद्र उपलब्ध` : `Showing ${filteredCenters.length} active procurement yards with verified live counters`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{language === 'mr' ? 'थेट रांग सुरू' : language === 'hi' ? 'लाइव कतार सक्रिय' : 'Live Queue Feed Active'}</span>
        </div>
      </div>

      {/* Center Cards Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCenters.map((center, index) => {
          const isRecommended = index === 0;
          const waitStatus = center.queue_length <= 8 ? 'low' : center.queue_length <= 15 ? 'moderate' : 'high';

          return (
            <div
              key={center.id}
              className={`bg-white rounded-3xl p-6 border transition-all shadow-xs flex flex-col justify-between relative overflow-hidden ${
                isRecommended
                  ? 'border-green-600 ring-2 ring-green-100 shadow-soft'
                  : 'border-gray-200 hover:border-green-300 hover:shadow-soft'
              }`}
            >
              <div>
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider w-fit mb-3">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>⭐ {t('recommended')} ({language === 'mr' ? 'कमी गर्दी' : language === 'hi' ? 'कम प्रतीक्षा' : 'Shortest Wait'})</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 leading-snug">
                      {center.name}
                    </h3>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-green-700 shrink-0" />
                      <span>{center.district} • {center.distance_km || 4.2} {language === 'mr' ? 'किमी अंतर' : language === 'hi' ? 'किमी दूर' : 'km away'}</span>
                    </div>
                  </div>

                  {/* Queue Status Pill */}
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shrink-0 ${
                      waitStatus === 'low'
                        ? 'bg-emerald-100 text-emerald-800'
                        : waitStatus === 'moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {waitStatus === 'low' ? `🟢 ${t('low_wait')}` : waitStatus === 'moderate' ? `🟡 ${t('moderate_wait')}` : `🔴 ${t('high_wait')}`}
                  </span>
                </div>

                {/* Center Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-gray-50 rounded-2xl text-center">
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">
                      {language === 'mr' ? 'रांग' : language === 'hi' ? 'कतार' : 'Queue'}
                    </div>
                    <div className="text-base font-black text-gray-900">
                      {center.queue_length} {language === 'mr' ? 'शेतकरी' : language === 'hi' ? 'किसान' : 'farmers'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">
                      {language === 'mr' ? 'काउंटर्स' : language === 'hi' ? 'काउंटर' : 'Counters'}
                    </div>
                    <div className="text-base font-black text-gray-900">
                      {center.active_counters} {language === 'mr' ? 'सक्रिय' : language === 'hi' ? 'सक्रिय' : 'active'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">
                      {language === 'mr' ? 'वेळ' : language === 'hi' ? 'समय' : 'Wait'}
                    </div>
                    <div className="text-base font-black text-green-700">
                      {Math.round(center.estimated_wait)} {language === 'mr' ? 'मि.' : language === 'hi' ? 'मि.' : 'min'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & MSP Action */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                <div>
                  <span className="text-sm font-black text-green-800">
                    ₹2,425 {language === 'mr' ? '/ क्विंटल' : language === 'hi' ? '/ क्विंटल' : '/ quintal'}
                  </span>
                  <span className="text-[10px] text-gray-400 block font-semibold">
                    {language === 'mr' ? 'शासकीय हमीभाव' : language === 'hi' ? 'सरकारी समर्थन मूल्य' : 'Official MSP Rate'}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/book-slot', { state: { center } })}
                  className="py-2.5 px-4 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-soft flex items-center gap-1.5 active:scale-95 transition"
                >
                  <span>{t('view_center')}</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
