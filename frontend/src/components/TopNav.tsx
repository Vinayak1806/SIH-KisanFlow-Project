import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, Bell, Globe, UserCheck, Shield, ChevronDown, 
  Check, Wifi, WifiOff, Home, Ticket, MapPin, Clock, User, 
  LayoutDashboard, Smartphone, Monitor 
} from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const TopNav: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, quickDemoLogin, logout, isOnline } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'en', label: 'English', native: 'English' },
  ];

  const desktopNavItems = [
    { path: '/dashboard', label: t('home'), icon: Home },
    { path: '/token', label: t('token'), icon: Ticket },
    { path: '/centers', label: t('centers'), icon: MapPin },
    { path: '/queue', label: t('queue'), icon: Clock },
    { path: '/history', label: t('history'), icon: Clock },
    { path: '/profile', label: t('profile'), icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1 sm:gap-3">
        
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer active:scale-95 transition-transform min-w-0 shrink"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white shadow-soft shrink-0">
            <Sprout className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-green-950 font-sans whitespace-nowrap">
                Kisan<span className="text-green-600">Flow</span>
              </span>
              <span className="text-[9px] font-bold bg-green-100 text-green-800 border border-green-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider hidden lg:inline-block">
                Govt. APMC Portal
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium -mt-0.5 hidden sm:block truncate">
              {language === 'mr' ? 'शासकीय शेतकरी रांग व खरेदी प्रणाली' : language === 'hi' ? 'स्मार्ट फसल खरीद एवं डिजिटल कतार' : 'Smart Agricultural Procurement & Virtual Queue'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links (Visible on Tablet & Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-200/80">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-green-700 text-white shadow-xs scale-102'
                    : 'text-gray-600 hover:text-green-800 hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons: Language, Notifications, Demo Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Offline / Online Pill */}
          {!isOnline && (
            <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
              <WifiOff className="w-3 h-3" /> <span className="hidden sm:inline">Offline</span>
            </span>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-700 active:scale-95 transition"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-700 shrink-0" />
              <span>{language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'EN'}</span>
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between hover:bg-green-50 ${
                      language === l.code ? 'text-green-800 font-bold bg-green-50/70' : 'text-gray-700'
                    }`}
                  >
                    <span>{l.native}</span>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-green-700 stroke-[3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Icon with Badge */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-1.5 sm:p-2 rounded-xl text-gray-600 hover:text-green-800 hover:bg-green-50 active:scale-95 transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
            <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setDemoOpen(!demoOpen)}
              className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-extrabold px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-green-700 to-green-800 text-white shadow-soft active:scale-95 hover:from-green-800 hover:to-green-900 transition whitespace-nowrap"
              title="Switch User Role"
            >
              <span>
                {user?.role === 'officer' 
                  ? (language === 'mr' ? '👮 अधिकारी' : language === 'hi' ? '👮 अधिकारी' : '👮 Officer') 
                  : user?.role === 'admin' 
                  ? (language === 'mr' ? '🏛️ प्रशासक' : language === 'hi' ? '🏛️ प्रशासक' : '🏛️ Admin') 
                  : (language === 'mr' ? '👨‍🌾 शेतकरी' : language === 'hi' ? '👨‍🌾 किसान' : '👨‍🌾 Farmer')}
              </span>
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-80" />
            </button>

            {demoOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] uppercase font-black text-gray-400 px-3 py-1">
                  {language === 'mr' ? 'सक्रिय भूमिका बदला' : language === 'hi' ? 'सक्रिय भूमिका बदलें' : 'Switch Active Portal Role'}
                </div>
                
                <button
                  onClick={() => {
                    quickDemoLogin('farmer');
                    setDemoOpen(false);
                    navigate('/dashboard');
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 hover:bg-green-50 transition ${
                    user?.role === 'farmer' ? 'bg-green-100 font-bold text-green-950' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">👨‍🌾</span>
                  <div>
                    <div className="font-bold">{language === 'mr' ? 'शेतकरी पोर्टल' : language === 'hi' ? 'किसान पोर्टल' : 'Farmer Demo'}</div>
                    <div className="text-[10px] text-gray-500">Rajesh Pawar (FARM1001)</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    quickDemoLogin('officer');
                    setDemoOpen(false);
                    navigate('/officer');
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 hover:bg-amber-50 transition ${
                    user?.role === 'officer' ? 'bg-amber-100 font-bold text-amber-950' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">👮</span>
                  <div>
                    <div className="font-bold">{language === 'mr' ? 'खरेदी अधिकारी' : language === 'hi' ? 'खरीद अधिकारी' : 'Procurement Officer'}</div>
                    <div className="text-[10px] text-gray-500">Pune Center (OFF1001)</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    quickDemoLogin('admin');
                    setDemoOpen(false);
                    navigate('/admin');
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 hover:bg-blue-50 transition ${
                    user?.role === 'admin' ? 'bg-blue-100 font-bold text-blue-950' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">🏛️</span>
                  <div>
                    <div className="font-bold">{language === 'mr' ? 'शासकीय कमांड' : language === 'hi' ? 'सरकारी कमांड' : 'Government Command'}</div>
                    <div className="text-[10px] text-gray-500">Agri Dept (ADMIN001)</div>
                  </div>
                </button>

                {user && (
                  <div className="mt-1 pt-1 border-t border-gray-100">
                    <button
                      onClick={() => {
                        logout();
                        setDemoOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl font-bold transition"
                    >
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
