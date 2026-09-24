import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, CheckCircle2, Star, ShieldCheck, ArrowRight, 
  MapPin, Clock, Users, BadgeIndianRupee, ChevronRight, Info 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export const SmartRecommendation: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [recData, setRecData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await api.getRecommendations(1, 35.0);
      setRecData(data);
      setLoading(false);
    }
    load();
  }, []);

  const rec = recData?.recommended;
  const alternatives = recData?.alternatives || [];

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-gray-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full w-fit border border-amber-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>AI Transparent Multi-Factor Decision Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-green-950">
            {t('best_option_heading')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {language === 'mr' 
              ? 'कमी गर्दी व जलद विक्रीसाठी किसानफ्लो अल्गोरिदमने निवडलेले केंद्र' 
              : language === 'hi' 
              ? 'न्यूनतम भीड़ और त्वरित बिक्री के लिए किसानफ्लो एआई द्वारा चयनित केंद्र' 
              : 'Multi-factor transparent evaluation prioritizing low wait times and proximity'}
          </p>
        </div>

        <button
          onClick={() => navigate('/centers')}
          className="px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold shrink-0 self-start sm:self-center"
        >
          {language === 'mr' ? '← सर्व केंद्रे पहा' : language === 'hi' ? '← सभी केंद्र देखें' : '← Browse All Centers'}
        </button>
      </div>

      {/* Responsive 2-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Top Recommendation Card (7 cols) */}
        {rec && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-green-600 shadow-token relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 text-xs font-black text-white bg-green-700 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>
                  {language === 'mr' ? 'सर्वोत्तम शिफारस' : language === 'hi' ? 'सर्वश्रेष्ठ सिफारिश' : 'Top Recommendation'} • {rec.score}/100
                </span>
              </span>
              <span className="text-xs font-black text-green-800 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                🟢 {t('low_wait')}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-gray-950 leading-snug">
              {rec.center_name}
            </h2>
            <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 mt-1.5">
              <MapPin className="w-4 h-4 text-green-700 shrink-0" />
              <span>
                {rec.distance_km} {language === 'mr' ? 'किमी अंतर (शिवणे, हवेली)' : language === 'hi' ? 'किमी दूर आपके गांव से (शिवणे, हवेली)' : 'km away from your village (Shivane, Haveli)'}
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 my-5 p-4 bg-green-50/70 rounded-2xl text-center border border-green-100">
              <div>
                <div className="text-[10px] sm:text-xs text-green-800 font-bold uppercase">
                  {language === 'mr' ? 'अंदाजे वेळ' : language === 'hi' ? 'अनुमानित समय' : 'Estimated Wait'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-green-900">
                  {Math.round(rec.estimated_wait)} {language === 'mr' ? 'मि.' : language === 'hi' ? 'मि.' : 'min'}
                </div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-green-800 font-bold uppercase">
                  {language === 'mr' ? 'रांगेतील शेतकरी' : language === 'hi' ? 'कतार में किसान' : 'Current Queue'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-green-900">
                  {rec.queue_length} {language === 'mr' ? 'शेतकरी' : language === 'hi' ? 'किसान' : 'farmers'}
                </div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-green-800 font-bold uppercase">
                  {language === 'mr' ? 'हमीभाव' : language === 'hi' ? 'समर्थन मूल्य' : 'MSP Price'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-green-900">₹{Math.round(rec.price).toLocaleString()}</div>
              </div>
            </div>

            {/* Transparent Reasons Section */}
            <div className="mb-5">
              <div className="text-xs font-bold text-gray-800 mb-2.5">
                {t('why_recommended')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rec.reasons?.map((reason: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span className="font-semibold">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparent Scoring Visual Bars */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 mb-6">
              <div className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-3">
                Scoring Breakdown by Weight
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                    <span>Distance (40% weight)</span>
                    <span className="font-bold text-green-800">{rec.score_breakdown?.distance_pct || 90}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${rec.score_breakdown?.distance_pct || 90}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                    <span>Queue Length (25% weight)</span>
                    <span className="font-bold text-green-800">{rec.score_breakdown?.queue_pct || 92}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${rec.score_breakdown?.queue_pct || 92}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                    <span>Waiting Time (20% weight)</span>
                    <span className="font-bold text-green-800">{rec.score_breakdown?.wait_pct || 94}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${rec.score_breakdown?.wait_pct || 94}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                    <span>Price / MSP (10% weight)</span>
                    <span className="font-bold text-green-800">{rec.score_breakdown?.price_pct || 100}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${rec.score_breakdown?.price_pct || 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Primary CTA */}
            <button
              onClick={() => navigate('/book-slot', { state: { centerId: rec.center_id, centerName: rec.center_name } })}
              className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm sm:text-base shadow-soft-lg flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <span>{t('choose_this_center')}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        )}

        {/* Right: Alternative Centers Comparison & Explanation (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-soft">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-gray-500 mb-4 px-1">
              {t('compare_centers')}
            </h3>

            <div className="space-y-3">
              {alternatives.map((alt: any) => (
                <div
                  key={alt.center_id}
                  className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 hover:bg-green-50/40 hover:border-green-300 transition flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">{alt.center_name}</div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      {alt.distance_km} km • {alt.queue_length} queue • {Math.round(alt.estimated_wait)} min wait
                    </div>
                    <div className="text-xs font-black text-green-800 mt-1">₹{alt.price} / Q</div>
                  </div>

                  <button
                    onClick={() => navigate('/book-slot', { state: { centerId: alt.center_id, centerName: alt.center_name } })}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-green-100 text-green-900 font-bold text-xs border border-gray-200 shadow-xs active:scale-95 transition"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Algorithm Guarantee Card */}
          <div className="bg-emerald-900 text-white rounded-3xl p-5 shadow-soft">
            <div className="flex items-center gap-2 text-emerald-300 mb-2 text-xs font-bold">
              <Info className="w-4 h-4" />
              <span>Transparent Multi-Factor Scoring Principle</span>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              KisanFlow never biases procurement centers based on hidden commercial factors. All recommendation weights are 100% visible and verifiable by farmers and government regulators.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
