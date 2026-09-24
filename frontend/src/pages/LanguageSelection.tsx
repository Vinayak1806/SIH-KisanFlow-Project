import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Globe } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';

export const LanguageSelection: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const options: { code: Language; title: string; native: string; desc: string; icon: string }[] = [
    {
      code: 'mr',
      title: 'Marathi',
      native: 'मराठी',
      desc: 'महाराष्ट्रातील सर्व शेतकरी बांधवांसाठी',
      icon: '🌾'
    },
    {
      code: 'hi',
      title: 'Hindi',
      native: 'हिंदी',
      desc: 'सरल एवं सुगम हिंदी भाषा में',
      icon: '🌱'
    },
    {
      code: 'en',
      title: 'English',
      native: 'English',
      desc: 'Official procurement portal in English',
      icon: '🌿'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F0] to-[#F4F9F4] flex flex-col justify-between p-6 max-w-xl mx-auto py-10">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-800 flex items-center justify-center">
            <Globe className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-green-950">
              {t('choose_language')}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Select your preferred language for the whole portal
            </p>
          </div>
        </div>

        {/* Big Selectable Cards */}
        <div className="space-y-4">
          {options.map((opt) => {
            const isSelected = language === opt.code;
            return (
              <div
                key={opt.code}
                onClick={() => setLanguage(opt.code)}
                className={`p-5 rounded-3xl cursor-pointer border-2 transition-all flex items-center justify-between shadow-xs ${
                  isSelected
                    ? 'border-green-600 bg-white ring-4 ring-green-100/80 shadow-soft'
                    : 'border-gray-200 bg-white/70 hover:bg-white hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{opt.icon}</span>
                  <div>
                    <div className="text-xl font-extrabold text-gray-900 leading-snug">
                      {opt.native}
                    </div>
                    <div className="text-xs font-semibold text-green-800">
                      {opt.title}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {opt.desc}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                    isSelected
                      ? 'bg-green-700 border-green-700 text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
        {/* Continue CTA */}
        <div className="pt-6">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-base shadow-soft-lg flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <span>{t('continue')}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
