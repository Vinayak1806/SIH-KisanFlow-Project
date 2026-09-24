import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, ShieldCheck, Clock, TrendingUp, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const WelcomeLanding: React.FC = () => {
  const { language, t } = useLanguage();
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
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F0] via-[#F4F9F4] to-[#FAF7F0] pb-24 md:pb-12 text-gray-900 w-full max-w-full overflow-x-hidden">
      
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2 max-w-full">
          <span className="text-[11px] sm:text-xs font-bold text-green-900 bg-green-100 px-2.5 sm:px-3 py-1 rounded-full border border-green-200">
            {language === 'mr' ? '🌾 महाराष्ट्र शासन • कृषी उत्पन्न बाजार समिती' : language === 'hi' ? '🌾 महाराष्ट्र शासन • कृषि उपज मंडी पोर्टल' : '🌾 Govt. of Maharashtra • APMC Mandi Portal'}
          </span>
          <span className="hidden sm:inline-block text-xs font-semibold text-gray-500">
            {language === 'mr' ? 'स्मार्ट शेतकरी डिजिटल खरेदी व रांग प्रणाली' : language === 'hi' ? 'स्मार्ट फसल खरीद एवं डिजिटल कतार प्रणाली' : 'Smart Virtual Queue & Agricultural Procurement Platform'}
          </span>
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
                {language === 'mr' ? 'डिजिटल पब्लिक इन्फ्रास्ट्रक्चर • स्मार्ट ऑटोमेशन' : language === 'hi' ? 'डिजिटल पब्लिक इन्फ्रास्ट्रक्चर • स्मार्ट ऑटोमेशन' : 'Digital Public Infrastructure • Smart Automation'}
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
                {t('why_kisanflow')}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-2">
                    <Clock className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="text-xs font-bold text-gray-900">
                    {t('time_saving')}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {t('time_saving_desc')}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                    <TrendingUp className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="text-xs font-bold text-gray-900">
                    {t('fair_msp')}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {t('fair_msp_desc')}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                    <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="text-xs font-bold text-gray-900">
                    {t('transparent_proc')}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {t('transparent_proc_desc')}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                    <Users className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="text-xs font-bold text-gray-900">
                    {t('fast_dbt')}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {t('fast_dbt_desc')}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 3 User Roles Cards */}
          <div className="lg:col-span-5 w-full space-y-4">
            
            <div className="bg-white p-6 rounded-3xl border border-green-200/90 shadow-soft text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-extrabold text-green-950 uppercase tracking-wider">
                  {language === 'mr' ? '🎯 सर्व ३ भूमिकांचा अनुभव घ्या' : language === 'hi' ? '🎯 सभी 3 भूमिकाओं का अनुभव लें' : '🎯 Experience All 3 Roles'}
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  1-Click Switch
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                {language === 'mr' ? 'शेतकरी बुकिंगपासून ते अधिकारी वजन पडताळणी आणि शासकीय डॅशबोर्डपर्यंत थेट प्रवाह तपासा:' : language === 'hi' ? 'किसान बुकिंग से लेकर तौल सत्यापन और सरकारी डैशबोर्ड तक संपूर्ण प्रवाह देखें:' : 'Test the complete flow from farmer booking to weighbridge officer verification and government analytics:'}
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleFarmerDemo}
                  className="w-full p-3.5 rounded-2xl border border-green-200 bg-green-50/60 hover:bg-green-100 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👨‍🌾</span>
                    <div>
                      <div className="text-sm font-extrabold text-green-950 group-hover:text-green-900">
                        {language === 'mr' ? 'शेतकरी डॅशबोर्ड (PWA)' : language === 'hi' ? 'किसान डैशबोर्ड (PWA)' : 'Farmer Dashboard (PWA)'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {language === 'mr' ? 'टोकन घ्या, थेट रांग #१२ पहा, पावती मिळवा' : language === 'hi' ? 'टोकन बुक करें, लाइव कतार #12 देखें, रसीद प्राप्त करें' : 'Book slot, track virtual queue #12, view receipt'}
                      </div>
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
                      <div className="text-sm font-extrabold text-amber-950 group-hover:text-amber-900">
                        {language === 'mr' ? 'खरेदी अधिकारी डेस्क' : language === 'hi' ? 'खरीद अधिकारी डेस्क' : 'Procurement Officer Desk'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {language === 'mr' ? 'शेतकरी पडताळणी, वजन काटा नोंद, डीबीटी पूर्ण करा' : language === 'hi' ? 'किसान सत्यापन, तौल कांटा प्रविष्टि, डीबीटी पूर्ण करें' : 'Verify farmer, enter weighbridge scale, complete DBT'}
                      </div>
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
                      <div className="text-sm font-extrabold text-blue-950 group-hover:text-blue-900">
                        {language === 'mr' ? 'शासकीय कमांड सेंटर' : language === 'hi' ? 'सरकारी कमांड सेंटर' : 'Government Command Center'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {language === 'mr' ? 'थेट गर्दी नियंत्रण, विश्लेषण व काउंटर सक्रियता' : language === 'hi' ? 'लाइव भीड़ प्रबंधन, विश्लेषण और काउंटर सक्रियण' : 'Live congestion heatmap, analytics, counter activation'}
                      </div>
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
                <strong>{language === 'mr' ? 'प्रणाली सक्रिय:' : language === 'hi' ? 'सिस्टम सक्रिय:' : 'System Live:'}</strong> {language === 'mr' ? '३०+ शेतकरी, ६ कृषी उत्पन्न बाजार समित्या व थेट रांग प्रणाली सुरू.' : language === 'hi' ? '30+ किसान, 6 मंडी केंद्र और लाइव कतार प्रबंधन सक्रिय।' : 'SQLite DB connected with 30+ farmers, 6 APMC centers, and virtual queue engine.'}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
