import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, Wheat, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export const TokenBooking: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const centerName = location.state?.centerName || "Pune Agriculture Procurement Center (APMC)";
  const centerId = location.state?.centerId || 1;

  const [cropId, setCropId] = useState<number>(1); // Wheat default
  const [quantity, setQuantity] = useState<number>(35.0);
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-24");
  const [selectedSlotId, setSelectedSlotId] = useState<number>(102); // 10:00 - 11:00
  const [bookingState, setBookingState] = useState<'idle' | 'booking' | 'success'>('idle');

  const dates = [
    { date: "2026-09-24", label: "Today (24 Sep)", sub: "आज" },
    { date: "2026-09-25", label: "Tomorrow (25 Sep)", sub: "उद्या" },
    { date: "2026-09-26", label: "Day After (26 Sep)", sub: "परवा" },
  ];

  const slots = [
    { id: 101, time: "09:00 - 10:00 AM", capacity: "18 / 25 slots", status: "available" },
    { id: 102, time: "10:00 - 11:00 AM", capacity: "14 / 25 slots", status: "available" },
    { id: 103, time: "11:00 - 12:00 PM", capacity: "3 / 25 slots", status: "limited" },
    { id: 104, time: "12:00 - 01:00 PM", capacity: "0 / 25 slots", status: "full" },
  ];

  const handleBook = async () => {
    setBookingState('booking');

    try {
      await api.bookSlot({
        center_id: centerId,
        crop_id: cropId,
        quantity: quantity,
        slot_id: selectedSlotId
      });
    } catch {
      // Prototype graceful pass
    }

    setTimeout(() => {
      setBookingState('success');
      setTimeout(() => {
        navigate('/token');
      }, 1000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
      
      {/* Top Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-gray-200/80 shadow-xs mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-green-950">
          {t('book_slot_title')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {language === 'mr' 
            ? 'खरेदी केंद्रावर माल आणण्याची वेळ आरक्षित करा' 
            : language === 'hi' 
            ? 'खरीद केंद्र पर उपज लाने का समय आरक्षित करें' 
            : 'Select convenient slot to avoid yard congestion'}
        </p>
      </div>

      {/* Responsive 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Center, Crop, and Quantity */}
        <div className="space-y-5">
          {/* Selected Center Summary Card */}
          <div className="bg-white p-5 rounded-3xl border border-green-200 shadow-soft">
            <div className="text-[10px] uppercase font-bold text-gray-400">
              {language === 'mr' ? 'निवडलेले खरेदी केंद्र' : language === 'hi' ? 'चयनित खरीद केंद्र' : 'Selected Procurement Yard'}
            </div>
            <div className="text-base font-extrabold text-gray-900 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-green-700 shrink-0" />
              <span>{centerName}</span>
            </div>
            <div className="text-xs text-green-700 font-bold mt-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {language === 'mr' ? 'शासकीय मान्यताप्राप्त बाजार समिती इलेक्ट्रॉनिक वजन काटा' : language === 'hi' ? 'सरकारी मान्यता प्राप्त मंडी इलेक्ट्रॉनिक तौल कांटा' : 'Official Government APMC Electronic Weighbridge'}
              </span>
            </div>
          </div>

          {/* Crop & Quantity Selection */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-soft space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {language === 'mr' ? 'पीक निवडा' : language === 'hi' ? 'फसल चुनें' : 'Crop to Sell'}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 1, name: language === 'mr' ? 'गहू (Wheat)' : language === 'hi' ? 'गेहूं (Wheat)' : 'Wheat', rate: '₹2,425/Q' },
                  { id: 2, name: language === 'mr' ? 'कापूस (Cotton)' : language === 'hi' ? 'कपास (Cotton)' : 'Cotton', rate: '₹7,100/Q' },
                  { id: 3, name: language === 'mr' ? 'भात (Rice)' : language === 'hi' ? 'चावल (Rice)' : 'Rice', rate: '₹2,369/Q' },
                  { id: 4, name: language === 'mr' ? 'सोयाबीन (Soybean)' : language === 'hi' ? 'सोयाबीन (Soybean)' : 'Soybean', rate: '₹4,892/Q' },
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCropId(c.id)}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      cropId === c.id
                        ? 'border-green-600 bg-green-50 font-bold text-green-950 ring-2 ring-green-100 shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-green-200'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">{c.name}</div>
                    <div className="text-xs text-green-700 font-bold mt-0.5">{c.rate}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Quantity */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-700">
                  {t('expected_weight')} ({language === 'mr' ? 'क्विंटल' : language === 'hi' ? 'क्विंटल' : 'Quintals'})
                </label>
                <span className="text-xs sm:text-sm font-black text-green-800 bg-green-100 px-3 py-1 rounded-xl">
                  {quantity} {language === 'mr' ? 'क्विंटल' : language === 'hi' ? 'क्विंटल' : 'Quintals'} (~{quantity * 100} kg)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-semibold">
                <span>Min: 5 Q</span>
                <span>Max: 150 Q</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Date, Time Slots, and Action */}
        <div className="space-y-5">
          {/* Date Selection */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-soft">
            <label className="block text-xs font-extrabold text-gray-700 mb-2.5">
              {t('select_date')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {dates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`p-3 rounded-2xl border text-center transition ${
                    selectedDate === d.date
                      ? 'border-green-600 bg-green-700 text-white font-bold shadow-soft'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                  }`}
                >
                  <div className="text-xs font-bold">{d.label.split(' ')[0]}</div>
                  <div className="text-[10px] opacity-80">{d.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-soft">
            <label className="block text-xs font-extrabold text-gray-700 mb-3">
              {t('select_time')}
            </label>
            <div className="space-y-2.5">
              {slots.map((s) => {
                const isSelected = selectedSlotId === s.id;
                const isFull = s.status === 'full';

                return (
                  <button
                    key={s.id}
                    disabled={isFull}
                    onClick={() => setSelectedSlotId(s.id)}
                    className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition ${
                      isFull
                        ? 'border-gray-200 bg-gray-100/70 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'border-green-600 bg-green-50 ring-2 ring-green-100 shadow-soft text-green-950 font-bold'
                        : 'border-gray-200 bg-white hover:border-green-300 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className={`w-4 h-4 ${isSelected ? 'text-green-700' : 'text-gray-400'}`} />
                      <div>
                        <div className="text-xs sm:text-sm font-bold">{s.time}</div>
                        <div className="text-[10px] text-gray-500">
                          {s.capacity} {language === 'mr' ? 'उपलब्ध' : language === 'hi' ? 'उपलब्ध' : 'available'}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isFull
                          ? 'bg-gray-200 text-gray-500'
                          : s.status === 'limited'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isFull ? (language === 'mr' ? 'पूर्ण' : language === 'hi' ? 'फुल' : 'Full') : s.status === 'limited' ? t('limited') : t('available')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            onClick={handleBook}
            disabled={bookingState !== 'idle'}
            className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm sm:text-base shadow-soft-lg flex items-center justify-center gap-2 active:scale-98 transition disabled:opacity-80"
          >
            {bookingState === 'booking' ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t('getting_token')}</span>
              </>
            ) : bookingState === 'success' ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>{t('token_created')}</span>
              </>
            ) : (
              <>
                <span>{t('get_my_token')}</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
