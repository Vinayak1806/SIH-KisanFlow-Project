import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, Download, ArrowRight, FileText, 
  BadgeIndianRupee, ShieldCheck, Printer, Share2 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ProcurementComplete: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    // Subtle confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2E7D32', '#F59E0B', '#1B5620']
      });
    } catch {
      // ignore
    }
  }, []);

  const receiptData = {
    receiptId: "RCPT-2026-00123",
    tokenId: "KF-2026-000123",
    farmerName: "Rajesh Baburao Pawar",
    farmerId: "FARM1001",
    crop: "Wheat (गहू)",
    quantity: "34.6 Quintals",
    rate: "₹2,425 / Quintal",
    totalAmount: "₹83,905",
    center: "Pune Agriculture Procurement Center (APMC)",
    date: "24 Sep 2026, 10:45 AM",
    officer: "Sanjay Deshmukh (Procurement Officer)"
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Top Banner / Celebration */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-3 shadow-soft ring-8 ring-green-50 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-green-950">
          {t('procurement_completed')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-md mx-auto">
          {language === 'mr' ? 'शेतमाल शासकीय हमीभावाने यशस्वीरित्या खरेदी करण्यात आला आहे' : 'Harvest successfully accepted as per Government MSP Standards'}
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Summary & Main Figure Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border-2 border-green-700/60 shadow-token text-center">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
            Total Payable Amount
          </div>
          
          <div className="text-4xl sm:text-5xl font-black text-green-950 my-2 font-mono">
            {receiptData.totalAmount}
          </div>
          
          <div className="text-xs font-bold text-green-800 bg-green-50 py-1.5 px-4 rounded-full w-fit mx-auto mt-1 border border-green-200">
            34.6 Quintals @ ₹2,425 / Q
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 text-left space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Receipt No:</span>
              <span className="font-mono font-bold text-gray-900">{receiptData.receiptId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Farmer:</span>
              <span className="font-bold text-gray-900">{receiptData.farmerName} ({receiptData.farmerId})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Center:</span>
              <span className="font-bold text-gray-900 truncate max-w-[240px]">{receiptData.center}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Procurement Date:</span>
              <span className="font-bold text-gray-900">{receiptData.date}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500 font-medium">Payment Status:</span>
              <span className="font-black text-emerald-700">● Initiated (Direct Benefit Transfer)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Official Verification Details */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Action Buttons */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-soft space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
              Next Action
            </h3>

            <button
              onClick={() => navigate('/payment-tracking')}
              className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm shadow-soft-lg flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <BadgeIndianRupee className="w-5 h-5" />
              <span>{t('track_payment')} (₹83,905) ➔</span>
            </button>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowReceiptModal(true)}
                className="py-3 px-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs border border-gray-200 shadow-xs flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <FileText className="w-4 h-4 text-green-700" />
                <span>{t('view_receipt')}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="py-3 px-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs border border-gray-200 shadow-xs flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Printer className="w-4 h-4 text-green-700" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>

          {/* Official Verification Stamp Card */}
          <div className="bg-emerald-50/60 rounded-3xl p-5 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Government Mandi Verified & Audited</span>
            </div>
            <p className="text-emerald-800 leading-relaxed text-[11px]">
              Procured under Food Corporation of India (FCI) Standards. Recorded by {receiptData.officer}.
              Payment will be directly disbursed to your NPCI Aadhaar linked bank account via PFMS.
            </p>
          </div>

        </div>

      </div>

      {/* Digital Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="text-center border-b pb-3 mb-4">
              <span className="text-xs font-bold text-green-800 uppercase">Government of Maharashtra</span>
              <h2 className="text-base font-black text-gray-900">Procurement Receipt</h2>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{receiptData.receiptId}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Farmer:</span>
                <span className="font-bold">{receiptData.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Crop:</span>
                <span className="font-bold">{receiptData.crop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Weight:</span>
                <span className="font-bold">{receiptData.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Procurement Rate:</span>
                <span className="font-bold">{receiptData.rate}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-black text-sm text-green-950">
                <span>Total Amount:</span>
                <span>{receiptData.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceiptModal(false)}
              className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
