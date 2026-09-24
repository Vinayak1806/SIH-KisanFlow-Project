import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Clock, Scale, FileText, CheckCheck, 
  BadgeIndianRupee, UserCheck, ArrowRight 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ProcurementTracking: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const stages = [
    {
      title: "1. Farmer Registration & Slot",
      title_mr: "१. शेतकरी नोंदणी व स्लॉट आरक्षण",
      time: "Today, 09:15 AM",
      status: "completed",
      officer: "Automated Digital Gateway",
      icon: CheckCircle2,
      desc: "Token KF-2026-000123 confirmed at Pune APMC Yard"
    },
    {
      title: "2. Document Verification",
      title_mr: "२. कागदपत्र व ७/१२ पडताळणी",
      time: "Today, 10:20 AM",
      status: "completed",
      officer: "Anand Kulkarni (Verification Officer)",
      icon: UserCheck,
      desc: "Aadhaar, Bank Account & 7/12 land records verified"
    },
    {
      title: "3. Electronic Weighbridge",
      title_mr: "३. इलेक्ट्रॉनिक वजन काटा",
      time: "Now in Progress (10:35 AM)",
      status: "in_progress",
      officer: "Nitin Jadhav (Weighbridge Incharge)",
      icon: Scale,
      desc: "Truck gross & tare weight measurement on certified scale"
    },
    {
      title: "4. Quality Check & Procurement",
      title_mr: "४. गुणवत्ता तपासणी व शेतमाल खरेदी",
      time: "Upcoming",
      status: "pending",
      officer: "Sanjay Deshmukh (Procurement Officer)",
      icon: FileText,
      desc: "Moisture & purity evaluation as per FCI standards"
    },
    {
      title: "5. Digital Receipt Generation",
      title_mr: "५. डिजिटल खरेदी पावती",
      time: "Upcoming",
      status: "pending",
      officer: "KisanFlow Automated Engine",
      icon: CheckCheck,
      desc: "Instant SMS receipt & official procurement record"
    },
    {
      title: "6. Direct Benefit Transfer (DBT)",
      title_mr: "६. थेट बँक खात्यात रक्कम जमा (DBT)",
      time: "Upcoming",
      status: "pending",
      officer: "PFMS / Treasury Integration",
      icon: BadgeIndianRupee,
      desc: "Automated payment release to Aadhaar-linked bank"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-green-950">
          {language === 'mr' ? 'खरेदी प्रक्रिया ट्रॅकिंग' : 'Procurement Journey Tracking'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Step-by-step transparent audit trail for Token KF-2026-000123
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Token Info & Action */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border-2 border-green-700/60 shadow-token">
            <span className="text-[10px] font-black uppercase tracking-wider text-green-800 bg-green-100 px-2.5 py-1 rounded-full border border-green-200">
              Active Procurement Token
            </span>
            <div className="text-2xl font-black font-mono text-green-950 mt-3">
              KF-2026-000123
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs sm:text-sm space-y-2">
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Farmer:</span>
                <span className="font-bold text-gray-900">Rajesh Baburao Pawar</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Crop:</span>
                <span className="font-bold text-gray-900">Wheat (35.0 Q)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Center:</span>
                <span className="font-bold text-gray-900 truncate max-w-[180px]">Pune APMC Mandi</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Current Stage:</span>
                <span className="font-black text-amber-700">● 4. Weighbridge Measurement</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/weighing')}
            className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm shadow-soft-lg flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <span>Open Weighbridge Scale Screen</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Right Column: Stepper Timeline */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-200 shadow-soft">
          <h2 className="text-xs uppercase font-extrabold tracking-wider text-gray-500 mb-5 px-1">
            Audit Trail Progression
          </h2>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-gray-200">
            {stages.map((st, i) => {
              const Icon = st.icon;
              const isCompleted = st.status === 'completed';
              const isCurrent = st.status === 'in_progress';

              return (
                <div key={i} className="relative flex items-start gap-4">
                  
                  {/* Stage Status Icon Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                      isCompleted
                        ? 'bg-green-700 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>

                  {/* Stage Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xs sm:text-sm font-extrabold ${isCurrent ? 'text-amber-800' : 'text-gray-900'}`}>
                        {language === 'mr' ? st.title_mr : st.title}
                      </h3>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-green-100 text-green-800'
                            : isCurrent
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {isCompleted ? 'Done ✓' : isCurrent ? 'Active ●' : 'Pending'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                      {st.desc}
                    </p>

                    <div className="text-[10px] text-gray-400 mt-1.5 flex items-center justify-between">
                      <span>Officer: {st.officer}</span>
                      <span>{st.time}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

