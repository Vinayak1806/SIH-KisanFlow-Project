import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Ticket, QrCode, Share2, Clock, Users, ArrowRight, 
  CheckCircle2, Sparkles, AlertCircle, Copy, Check, MapPin, Printer 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api, TokenData } from '../services/api';
import { useRealtimeQueue } from '../hooks/useRealtimeQueue';

export const DigitalToken: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [token, setToken] = useState<TokenData | null>(null);
  const [copied, setCopied] = useState(false);
  const { lastEvent } = useRealtimeQueue(1, user?.userId);

  useEffect(() => {
    api.getActiveToken().then(setToken);
  }, []);

  useEffect(() => {
    if (lastEvent?.event === 'queue.updated') {
      api.getActiveToken().then(setToken);
    }
  }, [lastEvent]);

  const handleShare = () => {
    if (navigator.share && token) {
      navigator.share({
        title: `KisanFlow Token ${token.token_id}`,
        text: `My procurement token is ${token.token_id} at ${token.center_name}. Queue position #${token.queue_position}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`KisanFlow Token: ${token?.token_id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentTokenId = token?.token_id || "KF-2026-000123";
  const queuePos = token?.queue_position || 12;
  const ahead = Math.max(0, queuePos - 1);
  const waitMin = Math.round(token?.estimated_wait || 25);

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
      
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-xs font-extrabold uppercase tracking-wider text-green-800 bg-green-100 px-3.5 py-1 rounded-full border border-green-200">
          Official Government Virtual Token
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-green-950 mt-2">
          {t('your_token')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Valid for entry at APMC Market Yard electronic check-in gate
        </p>
      </div>

      {/* Responsive 2-Column Grid on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Digital Token Pass Card (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl border-2 border-green-700/60 shadow-token overflow-hidden relative">
          
          {/* Pass Top Banner */}
          <div className="bg-gradient-to-r from-green-800 to-emerald-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌾</span>
              <div>
                <div className="font-extrabold text-sm sm:text-base tracking-tight">KisanFlow Digital Pass</div>
                <div className="text-[10px] sm:text-xs text-green-200">Dept of Agriculture & Farmers Welfare</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-1 rounded-md">
              2026-27
            </span>
          </div>

          {/* Token Number & Large QR Code */}
          <div className="p-6 sm:p-8 text-center">
            <div className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
              Token Identifier
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-wider text-green-950 font-mono my-1.5">
              {currentTokenId}
            </div>

            {/* High-Contrast QR Code */}
            <div className="my-5 flex justify-center">
              <div className="p-4 bg-white rounded-3xl border-2 border-gray-100 shadow-soft inline-block">
                <QRCodeSVG
                  value={`KISANFLOW:${currentTokenId}`}
                  size={190}
                  level="H"
                  fgColor="#17451B"
                  includeMargin={false}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Scan at gate or counter for instant automated check-in
            </p>

            {/* Dashed Ticket Cut Line */}
            <div className="relative my-6">
              <div className="border-t-2 border-dashed border-gray-200" />
              <div className="absolute -left-9 -top-3 w-6 h-6 bg-[#FAF7F0] rounded-full border-r border-gray-300" />
              <div className="absolute -right-9 -top-3 w-6 h-6 bg-[#FAF7F0] rounded-full border-l border-gray-300" />
            </div>

            {/* Details Table */}
            <div className="space-y-2.5 text-left text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Farmer:</span>
                <span className="font-extrabold text-gray-900">{token?.farmer_name || 'Rajesh Baburao Pawar'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Farmer ID:</span>
                <span className="font-mono font-bold text-gray-800">{token?.farmer_farmer_id || 'FARM1001'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Crop & Quantity:</span>
                <span className="font-extrabold text-green-900">{token?.crop_name || 'Wheat'} • {token?.quantity || 35} Quintals</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Procurement Yard:</span>
                <span className="font-bold text-gray-800 text-right">{token?.center_name || 'Pune APMC Market Yard'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Queue Position & Instructions (5 cols) */}
        <div className="md:col-span-5 space-y-5">
          
          {/* Virtual Queue Status Indicators */}
          <div className="bg-white rounded-3xl p-6 border border-green-200 shadow-soft">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
              Live Queue Status
            </h3>

            <div className="grid grid-cols-3 gap-2 p-3 bg-green-50/80 rounded-2xl border border-green-200/70 text-center mb-4">
              <div>
                <div className="text-[10px] text-green-800 uppercase font-bold">{t('queue_position')}</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">#{queuePos}</div>
              </div>
              <div>
                <div className="text-[10px] text-green-800 uppercase font-bold">{t('farmers_ahead')}</div>
                <div className="text-2xl sm:text-3xl font-black text-green-950">{ahead}</div>
              </div>
              <div>
                <div className="text-[10px] text-green-800 uppercase font-bold">{t('est_wait')}</div>
                <div className="text-2xl sm:text-3xl font-black text-green-900">{waitMin}m</div>
              </div>
            </div>

            {/* Live Indicator Pill */}
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>🟢 {t('you_are_in_queue')}</span>
            </div>
            <div className="text-[10px] text-gray-400 text-center mt-1.5">
              {t('queue_updates_auto')}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/queue')}
              className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm sm:text-base shadow-soft-lg flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <span>{t('view_queue')}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleShare}
                className="py-3 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs border border-gray-200 shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-green-700" />
                    <span>{t('share_token')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => window.print()}
                className="py-3 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs border border-gray-200 shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                <Printer className="w-4 h-4 text-green-700" />
                <span>Print Pass</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
