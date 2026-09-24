import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Ticket, MapPin, Clock, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    { path: '/dashboard', label: t('home'), icon: Home },
    { path: '/token', label: t('token'), icon: Ticket },
    { path: '/centers', label: t('centers'), icon: MapPin },
    { path: '/history', label: t('history'), icon: Clock },
    { path: '/profile', label: t('profile'), icon: User },
  ];

  // Only show on farmer routes
  const isFarmerRoute = [
    '/dashboard', '/token', '/centers', '/history', '/profile', 
    '/queue', '/recommendation', '/book-slot', '/weighing', 
    '/complete', '/payment-tracking', '/notifications'
  ].includes(location.pathname);

  if (!isFarmerRoute) return null;

  return (
    // Hidden on desktop (md:hidden) because desktop TopNav contains full navigation links
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg pb-safe">
      <div className="max-w-md mx-auto px-3 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90 ${
                isActive ? 'text-green-800 font-bold' : 'text-gray-500 hover:text-green-700'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-green-100 text-green-800 scale-110 shadow-xs' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
