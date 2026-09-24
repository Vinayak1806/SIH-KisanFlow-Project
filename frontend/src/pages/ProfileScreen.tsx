import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Phone, MapPin, Globe, Bell, Headphones, 
  LogOut, Shield, ChevronRight, Wheat, Check 
} from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-green-950 flex items-center gap-2">
          <User className="w-6 h-6 text-green-700" />
          <span>{t('profile')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Farmer Aadhaar & Bank Details, Preferences and Government Helpline
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Farmer ID Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border-2 border-green-700/50 shadow-token text-center relative overflow-hidden">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-700 to-emerald-500 text-white flex items-center justify-center mx-auto text-3xl font-black shadow-soft mb-4">
            👨‍🌾
          </div>

          <h2 className="text-xl font-black text-green-950">
            {user?.name || 'Rajesh Baburao Pawar'}
          </h2>
          <div className="text-xs font-mono font-bold text-green-800 bg-green-50 px-3 py-1 rounded-full w-fit mx-auto mt-1 border border-green-200">
            {user?.farmerIdStr || 'FARM1001'}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Verified Farmer • District Pune, Maharashtra
          </p>

          {/* Details Summary */}
          <div className="space-y-3 mt-6 pt-5 border-t border-gray-100 text-left text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400">Mobile:</span>
              <span className="font-bold text-gray-800">+91 98220 11001</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400">Village & Taluka:</span>
              <span className="font-bold text-gray-800">Shivane, Haveli</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400">Bank Account:</span>
              <span className="font-bold text-gray-800">Bank of Maharashtra (****4912)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">NPCI Aadhaar Link:</span>
              <span className="font-bold text-emerald-700">● Active & Verified</span>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences, Crops & Helpline */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Language Preference Section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-soft">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-green-700" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                {t('choose_language')}
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(['mr', 'hi', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
                    language === lang
                      ? 'bg-green-700 text-white shadow-soft'
                      : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                  }`}
                >
                  <span>{lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'English'}</span>
                  {language === lang && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Crop Preferences */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-soft">
            <div className="flex items-center gap-2 mb-3">
              <Wheat className="w-5 h-5 text-green-700" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                Registered Crops
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="bg-green-100 text-green-900 font-bold px-3.5 py-1.5 rounded-full border border-green-200">Wheat (गहू)</span>
              <span className="bg-green-100 text-green-900 font-bold px-3.5 py-1.5 rounded-full border border-green-200">Cotton (कापूस)</span>
              <span className="bg-gray-100 text-gray-600 px-3.5 py-1.5 rounded-full hover:bg-gray-200 transition cursor-pointer">+ Add Crop</span>
            </div>
          </div>

          {/* Support & Helpline */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-gray-900">Kisan Call Center Helpline</div>
                  <div className="text-xs sm:text-sm font-black text-green-800">Toll-Free 1800-180-1551 (24x7)</div>
                </div>
              </div>
              <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200">
                24x7 Help
              </span>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 flex items-center justify-center gap-2 transition active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </button>

        </div>

      </div>

    </div>
  );
};
