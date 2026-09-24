import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BadgeIndianRupee, CheckCircle2, ShieldCheck, ArrowRight, 
  Building2, Landmark, Check, Clock 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PaymentTracking: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const paymentSteps = [
    { 
      label: language === 'mr' ? 'शेतमाल खरेदी स्वीकारली' : language === 'hi' ? 'उपज खरीद स्वीकृत' : 'Procurement Accepted', 
      time: "24 Sep, 10:45 AM", 
      done: true 
    },
    { 
      label: language === 'mr' ? 'पावती तयार केली (RCPT-2026-00123)' : language === 'hi' ? 'रसीद तैयार की गई (RCPT-2026-00123)' : 'Receipt Generated (RCPT-2026-00123)', 
      time: "24 Sep, 10:46 AM", 
      done: true 
    },
    { 
      label: language === 'mr' ? 'पीएफएमएस (PFMS) कोषागार मंजुरी' : language === 'hi' ? 'पीएफएमएस (PFMS) कोषागार स्वीकृति' : 'PFMS Treasury Sanction', 
      time: "24 Sep, 10:48 AM", 
      done: true 
    },
    { 
      label: language === 'mr' ? 'थेट बँक खात्यात रक्कम वर्ग (DBT)' : language === 'hi' ? 'सीधा बैंक अंतरण (DBT) पूर्ण' : 'Direct Benefit Transfer (DBT) Settled', 
      time: "24 Sep, 10:50 AM", 
      done: true 
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-green-800 bg-green-100 px-3 py-1 rounded-full border border-green-200">
          Direct Benefit Transfer (DBT)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-green-950 mt-2">
          {t('payment_status')}
        </h1>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Amount Hero Card & Bank Details */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-green-700/60 shadow-token text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {language === 'mr' ? 'बँक खात्यात थेट जमा' : language === 'hi' ? 'बैंक खाते में सीधा जमा' : 'Credited to Bank Account'}
          </div>
          
          <div className="text-4xl sm:text-5xl font-black text-green-900 my-2 font-mono">
            ₹83,905
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full mt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>🟢 {t('payment_completed')}</span>
          </div>

          {/* Bank & UTR Details */}
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left text-xs sm:text-sm space-y-2.5">
            <div className="flex justify-between py-0.5">
              <span className="text-gray-500">{language === 'mr' ? 'लाभार्थ्याचे नाव' : language === 'hi' ? 'लाभार्थी का नाम' : 'Beneficiary Name'}:</span>
              <span className="font-extrabold text-gray-900">{language === 'mr' ? 'राजेश बाबुराव पवार' : language === 'hi' ? 'राजेश बाबूराव पवार' : 'Rajesh Baburao Pawar'}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-gray-500">{language === 'mr' ? 'बँक व खाते क्रमांक' : language === 'hi' ? 'बैंक एवं खाता संख्या' : 'Bank & Account'}:</span>
              <span className="font-bold text-gray-900">{language === 'mr' ? 'बँक ऑफ महाराष्ट्र (****४९१२)' : language === 'hi' ? 'बैंक ऑफ महाराष्ट्र (****4912)' : 'Bank of Maharashtra (****4912)'}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-gray-500">{language === 'mr' ? 'आधार संदर्भ' : language === 'hi' ? 'आधार संदर्भ' : 'Aadhaar Reference'}:</span>
              <span className="font-mono font-bold text-gray-800">XXXX-XXXX-8921 (NPCI Linked)</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-gray-500">{language === 'mr' ? 'डीबीटी / युटीआर क्रमांक' : language === 'hi' ? 'डीबीटी / यूटीआर संख्या' : 'DBT / UTR Number'}:</span>
              <span className="font-mono font-bold text-green-800">UTR20260924981240</span>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Navigation */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Timeline Steps */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-soft">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-gray-500 mb-5 px-1">
              {language === 'mr' ? 'व्यवहार प्रगती' : language === 'hi' ? 'लेन-देन प्रगति' : 'Transaction Progression'}
            </h2>

            <div className="space-y-5 relative before:absolute before:inset-0 before:left-3.5 before:h-full before:w-0.5 before:bg-green-600">
              {paymentSteps.map((st, i) => (
                <div key={i} className="relative flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center shrink-0 z-10 shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div className="flex-1 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-gray-900">{st.label}</span>
                    <span className="text-[10px] sm:text-xs text-gray-400">{st.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Return to Dashboard */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm shadow-soft-lg flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <span>{language === 'mr' ? 'मुख्यपृष्ठावर परत जा ➔' : language === 'hi' ? 'होम डैशबोर्ड पर लौटें ➔' : 'Back to Home Dashboard ➔'}</span>
          </button>

        </div>

      </div>

    </div>
  );
};
