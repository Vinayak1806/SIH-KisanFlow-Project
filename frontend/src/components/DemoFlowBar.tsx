import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, X, ChevronRight } from 'lucide-react';
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
        className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-green-800 via-emerald-800 to-green-900 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-full shadow-2xl border border-emerald-500/40 text-xs font-bold flex items-center gap-2.5 backdrop-blur-md transition-all active:scale-95 group hover:ring-4 hover:ring-emerald-500/20"
        title="Open Evaluator Presentation Shortcuts"
      >
        <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
        <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
        <span className="text-xs tracking-wide font-extrabold text-amber-100">Presentation Shortcuts</span>
      </button>
    );
  }

  return (
    <div className="sticky top-16 left-0 right-0 z-30 bg-gradient-to-r from-[#143320] via-[#1B432B] to-[#122E1D] text-white border-b border-emerald-600/40 shadow-lg backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs gap-3">
        
        {/* Title */}
        <div className="flex items-center gap-2 font-black text-amber-300 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-[11px] uppercase tracking-wider font-extrabold hidden sm:inline">
            Evaluator Presentation Shortcuts
          </span>
          <span className="text-[11px] uppercase tracking-wider font-extrabold sm:hidden">
            Shortcuts
          </span>
        </div>

        {/* Persona Buttons & Step Shortcuts */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 shrink-0 bg-black/25 p-1 rounded-xl border border-emerald-500/30">
            <button
              onClick={() => {
                quickDemoLogin('farmer');
                navigate('/dashboard');
              }}
              className="px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white rounded-lg text-[11px] font-bold shadow-xs whitespace-nowrap active:scale-95 transition"
            >
              👨‍🌾 Farmer
            </button>
            <button
              onClick={() => {
                quickDemoLogin('officer');
                navigate('/officer');
              }}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-lg text-[11px] font-black shadow-xs whitespace-nowrap active:scale-95 transition"
            >
              👮 Officer
            </button>
            <button
              onClick={() => {
                quickDemoLogin('admin');
                navigate('/admin');
              }}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold shadow-xs whitespace-nowrap active:scale-95 transition"
            >
              🏛️ Admin
            </button>
          </div>

          {/* Quick Step Buttons for Evaluator Ease */}
          <div className="hidden lg:flex items-center gap-1 border-l border-emerald-600/40 pl-2">
            {demoSteps.map((step) => {
              const isCurrent = location.pathname === step.path;
              return (
                <button
                  key={step.path}
                  onClick={() => navigate(step.path)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${
                    isCurrent
                      ? 'bg-amber-400 text-emerald-950 font-black shadow-soft'
                      : 'bg-emerald-950/60 hover:bg-emerald-800/80 text-emerald-100 border border-emerald-700/50'
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
            className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-800/60 transition shrink-0 ml-1"
            title="Minimize Shortcuts"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
