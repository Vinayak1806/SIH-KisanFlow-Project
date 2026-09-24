import React from 'react';
import { Clock, Download, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HistoryScreen: React.FC = () => {
  const { t, language } = useLanguage();

  const history = [
    {
      id: "RCPT-2026-00123",
      crop: "Wheat (गहू)",
      quantity: "34.6 Quintals",
      date: "24 Sep 2026",
      center: "Pune Agriculture Procurement Center (APMC)",
      amount: "₹83,905",
      rate: "₹2,425 / Q",
      status: "Paid ✓",
      badge: "bg-emerald-100 text-emerald-800"
    },
    {
      id: "RCPT-2026-00089",
      crop: "Cotton (कापूस)",
      quantity: "22.0 Quintals",
      date: "12 May 2026",
      center: "Baramati Kisan Sahakari Yard",
      amount: "₹1,56,200",
      rate: "₹7,100 / Q",
      status: "Paid ✓",
      badge: "bg-emerald-100 text-emerald-800"
    },
    {
      id: "RCPT-2025-01420",
      crop: "Soybean (सोयाबीन)",
      quantity: "28.5 Quintals",
      date: "18 Nov 2025",
      center: "Pune APMC Market Yard",
      amount: "₹1,39,422",
      rate: "₹4,892 / Q",
      status: "Paid ✓",
      badge: "bg-emerald-100 text-emerald-800"
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-green-950 flex items-center gap-2">
            <Clock className="w-6 h-6 text-green-700" />
            <span>{t('history')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Archived government procurement receipts & DBT payouts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200">
            3 Completed Transactions
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:border-green-300 hover:shadow-soft transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">{item.crop}</h3>
                  <span className="text-[10px] text-gray-400 font-mono">{item.id}</span>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${item.badge}`}>
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-gray-100 my-3">
                <div>
                  <span className="text-gray-400 text-[10px] block">Quantity:</span>
                  <span className="font-bold text-gray-800">{item.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Procurement Rate:</span>
                  <span className="font-bold text-gray-800">{item.rate}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Date:</span>
                  <span className="font-semibold text-gray-700">{item.date}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Total Amount:</span>
                  <span className="font-black text-green-900 text-sm">{item.amount}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 truncate mb-4">
                📍 {item.center}
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-gray-50 hover:bg-green-50 text-green-800 font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Digital Receipt (PDF)</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
