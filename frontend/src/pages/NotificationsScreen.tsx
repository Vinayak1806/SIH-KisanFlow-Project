import React from 'react';
import { Bell, Ticket, MapPin, BadgeIndianRupee, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NotificationsScreen: React.FC = () => {
  const { t, language } = useLanguage();

  const notifications = [
    {
      id: 1,
      type: "payment",
      title: language === 'mr' ? 'डीबीटी रक्कम जमा' : language === 'hi' ? 'डीबीटी भुगतान जमा' : 'Payment Credited (DBT)',
      message: language === 'mr' 
        ? 'गहू खरेदीचे ₹८३,९०५ पीएफएमएसद्वारे आपल्या आधार संलग्न बँक खात्यात जमा झाले आहेत.' 
        : language === 'hi'
        ? 'गेहूं खरीद के ₹83,905 पीएफएमएस के माध्यम से आपके बैंक खाते में जमा हो चुके हैं।'
        : 'Your payment of ₹83,905 for Wheat procurement has been credited to your bank account via PFMS.',
      time: language === 'mr' ? '१० मिनिटांपूर्वी' : language === 'hi' ? '10 मिनट पहले' : '10 min ago',
      icon: BadgeIndianRupee,
      color: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },
    {
      id: 2,
      type: "queue",
      title: language === 'mr' ? 'रांग क्रमांक बदलला (#१२ ➔ #११)' : language === 'hi' ? 'कतार क्रमांक अपडेट (#12 ➔ #11)' : 'Queue Position Update (#12 ➔ #11)',
      message: language === 'mr'
        ? 'एका शेतकऱ्याची खरेदी पूर्ण झाली. पुणे बाजार समिती यार्डात आपला रांग क्रमांक #११ झाला आहे.'
        : language === 'hi'
        ? 'एक किसान की खरीद पूर्ण हुई। पुणे मंडी यार्ड में आपका कतार क्रमांक #11 हो गया है।'
        : 'One farmer completed procurement. You have moved up to Position #11 at Pune APMC Yard.',
      time: language === 'mr' ? '२५ मिनिटांपूर्वी' : language === 'hi' ? '25 मिनट पहले' : '25 min ago',
      icon: Bell,
      color: "bg-amber-100 text-amber-900 border-amber-200"
    },
    {
      id: 3,
      type: "counter",
      title: language === 'mr' ? 'काउंटर ३ सुरू करण्यात आला' : language === 'hi' ? 'काउंटर 3 सक्रिय किया गया' : 'Counter 3 Activated',
      message: language === 'mr'
        ? 'प्रतीक्षा वेळ २०% कमी करण्यासाठी प्रशासनाने काउंटर ३ सुरू केला आहे.'
        : language === 'hi'
        ? 'प्रतीक्षा समय 20% कम करने के लिए प्रशासन द्वारा काउंटर 3 सक्रिय किया गया।'
        : 'Government Admin has activated Counter 3 to reduce queue wait time by 20%.',
      time: language === 'mr' ? '४० मिनिटांपूर्वी' : language === 'hi' ? '40 मिनट पहले' : '40 min ago',
      icon: MapPin,
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      id: 4,
      type: "token",
      title: language === 'mr' ? 'टोकन निश्चित झाले' : language === 'hi' ? 'टोकन पुष्टिकरण' : 'Token Confirmed',
      message: language === 'mr'
        ? '३५ क्विंटल गव्हासाठी टोकन (KF-2026-000123) सकाळी १०:०० - ११:०० वेळेसाठी निश्चित झाले आहे.'
        : language === 'hi'
        ? '35 क्विंटल गेहूं के लिए टोकन (KF-2026-000123) सुबह 10:00 - 11:00 स्लॉट हेतु पक्का हुआ।'
        : 'Your procurement slot for 35 Q Wheat (KF-2026-000123) is confirmed for 10:00 - 11:00 AM.',
      time: language === 'mr' ? '१ तासापूर्वी' : language === 'hi' ? '1 घंटा पहले' : '1 hour ago',
      icon: Ticket,
      color: "bg-green-100 text-green-900 border-green-200"
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-24 md:pb-12 text-gray-900 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-green-950 flex items-center gap-2">
            <Bell className="w-6 h-6 text-green-700" />
            <span>{t('notifications')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {language === 'mr' 
              ? 'थेट खरेदी सूचना, रांग अपडेट्स व एसएमएस सूचना' 
              : language === 'hi' 
              ? 'लाइव खरीद सूचनाएं, कतार अपडेट और एसएमएस अलर्ट' 
              : 'Real-time procurement alerts, queue updates & SMS notifications'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200">
            4 {language === 'mr' ? 'नवीन सूचना' : language === 'hi' ? 'नए अपडेट' : 'Unread Updates'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs flex items-start gap-4 hover:shadow-soft hover:border-green-300 transition"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${n.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-gray-900">{n.title}</h3>
                  <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{n.message}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
