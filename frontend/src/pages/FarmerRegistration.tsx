import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Wheat, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const FarmerRegistration: React.FC = () => {
  const { t, language } = useLanguage();
  const { loginFarmer } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    farmerId: 'FARM1001',
    name: 'Rajesh Baburao Pawar',
    mobile: '9822011001',
    village: 'Shivane',
    district: 'Pune',
    crop: 'Wheat',
    otp: '123456'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFillDemo = () => {
    setFormData({
      farmerId: 'FARM1001',
      name: 'Rajesh Baburao Pawar',
      mobile: '9822011001',
      village: 'Shivane',
      district: 'Pune',
      crop: 'Wheat',
      otp: '123456'
    });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farmerId || !formData.mobile) {
      setErrorMsg('Please enter Farmer ID and Mobile Number');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const success = await loginFarmer(formData.farmerId, formData.otp);
    setIsSubmitting(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setErrorMsg('Invalid OTP. Please use demo OTP: 123456');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F0] to-[#F4F9F4] max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col justify-between">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-soft">
        
        {/* Header with Step Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
            <span className="text-green-800 uppercase tracking-wider">
              {step === 1 ? t('step_1_of_2') : 'Step 2 of 2 — OTP Verification'}
            </span>
            <button
              onClick={handleFillDemo}
              className="flex items-center gap-1 text-[11px] bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg hover:bg-amber-200 transition font-bold"
              type="button"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Auto-Fill Demo</span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-green-950">
            {step === 1 ? t('farmer_login') : 'ओटीपी पडताळणी / Verify OTP'}
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            {step === 1 
              ? (language === 'mr' ? 'शासकीय नोंदणीकृत माहिती भरा' : 'Enter your registered details to continue')
              : (language === 'mr' ? 'मोबाईलवर आलेला ६ अंकी ओटीपी टाका' : 'Enter 6-digit OTP sent to registered number')
            }
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Registration / Login Details */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            {/* Farmer ID */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('enter_farmer_id')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-green-700">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.farmerId}
                  onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                  placeholder="e.g. FARM1001"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-xs uppercase"
                />
              </div>
            </div>

            {/* Farmer Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {language === 'mr' ? 'शेतकऱ्याचे नाव' : 'Farmer Name'}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-xs"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-green-700">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-xs"
                />
              </div>
            </div>

            {/* Village & District (2 cols) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'mr' ? 'गाव' : 'Village'}
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3.5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'mr' ? 'जिल्हा' : 'District'}
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3.5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-xs"
                />
              </div>
            </div>

            {/* Main Crop Select */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {language === 'mr' ? 'प्रमुख पीक' : 'Main Crop'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-green-700">
                  <Wheat className="w-5 h-5" />
                </div>
                <select
                  value={formData.crop}
                  onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-xs appearance-none"
                >
                  <option value="Wheat">Wheat / गहू</option>
                  <option value="Cotton">Cotton / कापूस</option>
                  <option value="Rice">Rice / भात (धान)</option>
                  <option value="Soybean">Soybean / सोयाबीन</option>
                  <option value="Jowar">Jowar / ज्वारी</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-base shadow-soft-lg flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <span>{t('continue')}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-5">
            <div className="p-4 bg-white rounded-3xl border border-green-200 shadow-soft">
              <div className="text-xs text-gray-600 mb-1">
                {t('otp_sent_to')} <span className="font-bold text-gray-900">******{formData.mobile.slice(-4)}</span>
              </div>
              <div className="text-[11px] font-bold text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>{t('demo_otp_hint')}</span>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t('enter_otp')}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  className="w-full text-center text-2xl font-extrabold tracking-widest py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-green-950 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-3.5 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-sm shadow-soft-lg flex items-center justify-center gap-2 active:scale-98 transition disabled:opacity-60"
              >
                {isSubmitting ? 'Verifying...' : t('verify_continue')}
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        )}

      </div>

      <div className="text-center text-[11px] text-gray-400 mt-6">
        Department of Agriculture & Farmers Welfare • Government of Maharashtra
      </div>
    </div>
  );
};
