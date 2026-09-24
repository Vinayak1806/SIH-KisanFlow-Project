import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, CheckCircle2, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export const WeighingScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [liveWeight, setLiveWeight] = useState(30.0);
  const targetWeight = 34.6; // Quintals
  const expectedWeight = 35.0; // Quintals
  const [isStable, setIsStable] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveWeight((prev) => {
        if (prev < targetWeight) {
          return +(prev + 0.9).toFixed(1);
        } else {
          setIsStable(true);
          clearInterval(timer);
          return targetWeight;
        }
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  const handleConfirm = async () => {
    try {
      await api.recordWeighing("KF-2026-000123", targetWeight, "Weighed on Pune APMC Electronic Weighbridge");
    } catch {
      // prototype pass
    }
    navigate('/complete');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
      
      {/* Top Header */}
      <div className="text-center mb-6">
        <span className="text-xs font-extrabold uppercase tracking-wider text-green-800 bg-green-100 px-3.5 py-1 rounded-full border border-green-200">
          Certified Electronic Weighbridge #3
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-green-950 mt-2">
          {t('weighing_in_progress')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Government Metrology Legal Standard Certified • Live Calibration Synced
        </p>
      </div>

      {/* 2-Column Responsive Grid on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left: Main Digital Scale Display Card (7 cols) */}
        <div className="md:col-span-7 bg-gray-950 rounded-3xl p-6 sm:p-8 border-4 border-gray-800 shadow-token text-center text-white relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-3">
            <span>SCALE ID: WB-PUN-03</span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${isStable ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-amber-500/20 text-amber-400 animate-pulse'}`}>
              {isStable ? 'STABLE ● CERTIFIED' : 'MEASURING...'}
            </span>
          </div>

          {/* Big Weight LED Number */}
          <div className="my-6 font-mono">
            <div className="text-6xl sm:text-7xl font-black text-emerald-400 tracking-tight">
              {liveWeight.toFixed(1)}
            </div>
            <div className="text-base sm:text-lg font-bold text-gray-300 tracking-widest mt-2">
              QUINTALS ({Math.round(liveWeight * 100)} KG)
            </div>
          </div>

          {/* Scale Progress Pan */}
          <div className="w-full bg-gray-900 h-3.5 rounded-full overflow-hidden mt-6 border border-gray-700">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (liveWeight / expectedWeight) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-gray-500 mt-2">
            <span>0.0 Q</span>
            <span>Target: {expectedWeight} Q</span>
          </div>
        </div>

        {/* Right: Summary & Confirmation (5 cols) */}
        <div className="md:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-soft">
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4">
              Weight Verification Summary
            </h2>

            <div className="grid grid-cols-2 gap-3 text-center mb-5">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-[10px] text-gray-500 uppercase font-bold">{t('expected_weight')}</div>
                <div className="text-xl font-black text-gray-700">{expectedWeight} Q</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Declared at booking</div>
              </div>

              <div className="p-3.5 bg-green-50 rounded-2xl border border-green-200">
                <div className="text-[10px] text-green-800 uppercase font-bold">{t('actual_weight')}</div>
                <div className="text-xl font-black text-green-950">{targetWeight} Q</div>
                <div className="text-[10px] text-green-700 font-bold mt-0.5">Verified on Scale</div>
              </div>
            </div>

            {/* Pricing Calculation Preview */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1.5 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Crop / Variety:</span>
                <span className="font-bold text-gray-900">Wheat (Grade A)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Procurement MSP Rate:</span>
                <span className="font-bold text-gray-900">₹2,425 / quintal</span>
              </div>
              <div className="flex justify-between border-t border-emerald-200 pt-2 font-black text-sm text-green-950">
                <span>Total Payable Value:</span>
                <span className="text-base text-green-900">₹83,905</span>
              </div>
            </div>

            {/* Confirmation CTA */}
            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm sm:text-base shadow-soft-lg flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <span>{t('confirm_weight')} (३४.६ Q) ➔</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
