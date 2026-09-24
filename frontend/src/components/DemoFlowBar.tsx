import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DemoFlowBar: React.FC = () => {
  const { user, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const demoSteps = [
    { label: "1. Home", path: "/dashboard" },
    { label: "2. Centers", path: "/centers" },
    { label: "3. Rec", path: "/recommendation" },
    { label: "4. Book Slot", path: "/book-slot" },
    { label: "5. Token #12", path: "/token" },
    { label: "6. Live Queue", path: "/queue" },
    { label: "7. Officer Desk", path: "/officer" },
    { label: "8. Weighing", path: "/weighing" },
    { label: "9. Payment", path: "/payment-tracking" },
    { label: "10. Govt Admin", path: "/admin" },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-slate-900/90 hover:bg-slate-900 text-white px-3.5 py-2 rounded-full shadow-2xl border border-slate-700/80 text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all active:scale-95 group hover:ring-4 hover:ring-amber-500/20"
        title="Open Evaluator Presentation Shortcuts"
      >
        <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
        <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="text-[11px] tracking-wide">Presentation Shortcuts</span>
      </button>
    );
  }

  return (
    <div className="sticky top-16 left-0 right-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-xl animate-in slide-in-from-top-2 duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs gap-3">
        
        {/* Title */}
        <div className="flex items-center gap-2 font-black text-amber-400 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] uppercase tracking-wider font-extrabold hidden sm:inline">
            Evaluator Presentation Shortcuts
          </span>
          <span className="text-[11px] uppercase tracking-wider font-extrabold sm:hidden">
            Shortcuts
          </span>
        </div>

        {/* Persona Buttons & Step Shortcuts */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 shrink-0 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => {
                quickDemoLogin('farmer');
                navigate('/dashboard');
              }}
              className="px-2.5 py-1 bg-green-700 hover:bg-green-800 text-white rounded-lg text-[11px] font-bold shadow-xs whitespace-nowrap active:scale-95 transition"
            >
              👨‍🌾 Farmer
            </button>
            <button
              onClick={() => {
                quickDemoLogin('officer');
                navigate('/officer');
              }}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shadow-xs whitespace-nowrap active:scale-95 transition"
            >
              👮 Officer
            </button>
            <button
              onClick={() => {
                quickDemoLogin('admin');
                navigate('/admin');
              }}
              className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-[11px] font-bold shadow-xs whitespace-nowrap active:scale-95 transition"
            >
              🏛️ Admin
            </button>
          </div>

          {/* Quick Step Buttons for Evaluator Ease */}
          <div className="hidden lg:flex items-center gap-1 border-l border-slate-700 pl-2">
            {demoSteps.map((step) => {
              const isCurrent = location.pathname === step.path;
              return (
                <button
                  key={step.path}
                  onClick={() => navigate(step.path)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition shrink-0 ml-1"
            title="Minimize Shortcuts"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
