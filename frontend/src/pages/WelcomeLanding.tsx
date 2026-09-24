import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, ShieldCheck, Clock, TrendingUp, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const WelcomeLanding: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleFarmerDemo = async () => {
    await quickDemoLogin('farmer');
    navigate('/dashboard');
  };

  const handleOfficerDemo = async () => {
    await quickDemoLogin('officer');
    navigate('/officer');
  };

  const handleAdminDemo = async () => {
    await quickDemoLogin('admin');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F0] via-[#F4F9F4] to-[#FAF7F0] pb-24 md:pb-12 text-gray-900">
      
      {/* Top Language Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-green-900 bg-green-100 px-3 py-1 rounded-full border border-green-200">
            🌾 Govt. of Maharashtra • APMC Mandi Portal
          </span>
          <span className="hidden sm:inline-block text-xs font-semibold text-gray-500">
            Smart Virtual Queue & Agricultural Procurement Platform
          </span>
        </div>
        
        {/* Quick Language Toggle */}
        <div className="flex bg-white/90 backdrop-blur-md rounded-2xl p-1 border border-green-200 shadow-xs">
          {(['mr', 'hi', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                language === lang
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-green-800'
              }`}
            >
              {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'EN'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: Responsive Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Brand, Tagline, Actions, and 4 Pillars */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Brand Icon & Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-tr from-green-700 to-emerald-500 flex items-center justify-center text-white shadow-soft-lg ring-8 ring-green-100/60 animate-in fade-in zoom-in duration-300 shrink-0">
                <Sprout className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.3]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-green-950 tracking-tight leading-none">
                  Kisan<span className="text-green-600">Flow</span>
                </h1>
                <p className="text-xs sm:text-sm font-bold text-green-800 mt-1">
                  {language === 'mr' ? 'स्मार्ट शेतकरी डिजिटल खरेदी व रांग प्रणाली' : language === 'hi' ? 'स्मार्ट फसल खरीद एवं डिजिटल कतार प्रणाली' : 'Smart Agricultural Procurement & Virtual Queue Platform'}
                </p>
              </div>
            </div>

            {/* Hero Headline Card */}
            <div className="mt-4 bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-green-200/80 shadow-soft w-full relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-green-50 rounded-full pointer-events-none" />
              
              <span className="inline-block text-[11px] font-extrabold text-green-800 bg-green-50 border border-green-200 px-3 py-0.5 rounded-full uppercase tracking-wider mb-2">
                Digital Public Infrastructure • Smart Automation
              </span>

              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                {t('tagline')}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                {t('sub_tagline')}
              </p>

              {/* Core Philosophy Pill */}
              <div className="mt-4 p-3 bg-green-50/90 rounded-2xl border border-green-200/80 text-xs font-bold text-green-900 flex items-center gap-2">
                <span className="text-base">⚡</span>
                <span>{t('slogan')}</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold text-sm sm:text-base shadow-soft-lg flex items-center justify-center gap-3 active:scale-98 transition transform"
              >
                <span>{t('get_started')}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                onClick={handleFarmerDemo}
                className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-green-50 text-green-900 font-bold text-sm sm:text-base border-2 border-green-600/30 shadow-xs flex items-center justify-center gap-2 active:scale-98 transition"
              >
                <span>👨‍🌾 {t('explore_demo')} (Rajesh)</span>
              </button>
            </div>

            {/* 4 Pillars of KisanFlow */}
            <div className="w-full mt-8">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-gray-500 mb-3 px-1 text-left">
                {language === 'mr' ? 'किसानफ्लोचे फायदे' : language === 'hi' ? 'किसानफ्लो के प्रमुख लाभ' : 'Why KisanFlow?'}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-2">
                    <Clock className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="text-xs font-bold text-gray-900">
                    {language === 'mr' ? 'वेळेची बचत' : language === 'hi' ? 'समय की बचत' : 'Less Waiting'}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {language === 'mr' ? 'थेट डिजिटल रांग व टोकन' : language === 'hi' ? 'डिजिटल टोकन व कतार' : 'Virtual queue & AI wait time'}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                    <TrendingUp className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="text-xs font-bold text-gray-900">
                    {language === 'mr' ? 'योग्य हमीभाव' : language === 'hi' ? 'उचित हमीभाव' : 'Live MSP Rates'}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {language === 'mr' ? '१००% शासकीय दर खात्री' : language === 'hi' ? 'पारदर्शी सरकारी भाव' : 'Guaranteed MSP rates'}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                    <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="text-xs font-bold text-gray-900">
                    {language === 'mr' ? 'पारदर्शक खरेदी' : language === 'hi' ? 'पारदर्शी प्रक्रिया' : 'Transparent Weighing'}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {language === 'mr' ? 'डिजिटल पावती व ऑडिट' : language === 'hi' ? 'डिजिटल रसीद और ट्रैकिंग' : 'Instant digital receipt'}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-purple-100 text-purple-700 flex items-center justify-center mb-2">
                  <Users className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="text-xs font-bold text-gray-900">
                  {language === 'mr' ? 'थेट बँक जमा' : language === 'hi' ? 'सीधा बैंक भुगतान' : 'Fast DBT Payment'}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  {language === 'mr' ? 'आधार संलग्न खात्यात थेट' : language === 'hi' ? 'खाते में त्वरित डीबीटी' : 'Direct benefit transfer'}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 3 User Roles Cards for Evaluator Ease */}
          <div className="lg:col-span-5 w-full space-y-4">
            
            <div className="bg-white p-6 rounded-3xl border border-green-200/90 shadow-soft text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-extrabold text-green-950 uppercase tracking-wider">
                  🎯 Experience All 3 Roles
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  1-Click Switch
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Test the complete flow from farmer booking to weighbridge officer verification and government analytics:
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleFarmerDemo}
                  className="w-full p-3.5 rounded-2xl border border-green-200 bg-green-50/60 hover:bg-green-100 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👨‍🌾</span>
                    <div>
                      <div className="text-sm font-extrabold text-green-950 group-hover:text-green-900">Farmer Dashboard (PWA)</div>
                      <div className="text-xs text-gray-500">Book slot, track virtual queue #12, view receipt</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-green-700 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleOfficerDemo}
                  className="w-full p-3.5 rounded-2xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👮</span>
                    <div>
                      <div className="text-sm font-extrabold text-amber-950 group-hover:text-amber-900">Procurement Officer Desk</div>
                      <div className="text-xs text-gray-500">Verify farmer, enter weighbridge scale, complete DBT</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-700 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleAdminDemo}
                  className="w-full p-3.5 rounded-2xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏛️</span>
                    <div>
                      <div className="text-sm font-extrabold text-blue-950 group-hover:text-blue-900">Government Command Center</div>
                      <div className="text-xs text-gray-500">Live congestion heatmap, analytics, counter activation</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-700 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Live Readiness Badge */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                <strong>System Live:</strong> SQLite DB seeded with 30+ farmers, 6 APMC centers, and historical queue regression data.
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
