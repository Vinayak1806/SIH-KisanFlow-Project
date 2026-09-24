import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Scale, FileText, BadgeIndianRupee, 
  Volume2, Search, ArrowRight, UserCheck, RefreshCw, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { api, TokenData } from '../services/api';
import { useRealtimeQueue } from '../hooks/useRealtimeQueue';

export const OfficerDashboard: React.FC = () => {
  const [queueData, setQueueData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToken, setSelectedToken] = useState<string>("KF-2026-000123");
  const [actualWeight, setActualWeight] = useState<number>(34.6);
  const [actionNotice, setActionNotice] = useState<string>('');
  const [voiceScript, setVoiceScript] = useState<string>('');

  const { lastEvent } = useRealtimeQueue(1);

  const loadData = async () => {
    const data = await api.getCenterQueue(1);
    setQueueData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (lastEvent?.event === 'queue.updated' || lastEvent?.event === 'payment.completed') {
      loadData();
    }
  }, [lastEvent]);

  const handleVerify = async () => {
    setActionNotice('Verifying documents for Token KF-2026-000123...');
    await api.verifyFarmer("KF-2026-000123", "Verified by Officer Sanjay Deshmukh");
    setActionNotice('✓ Farmer Documents Verified! Stage advanced to Weighing.');
    loadData();
  };

  const handleWeigh = async () => {
    setActionNotice(`Recording weight ${actualWeight} Q on certified weighbridge...`);
    await api.recordWeighing("KF-2026-000123", actualWeight, "Measured on Electronic Scale #3");
    setActionNotice(`✓ Actual Weight of ${actualWeight} Q logged successfully!`);
    loadData();
  };

  const handleProcure = async () => {
    setActionNotice('Completing procurement and generating digital receipt...');
    await api.completeProcurement("KF-2026-000123", "FCI Quality standards satisfied");
    setActionNotice('✓ Crop accepted! Receipt RCPT-2026-00123 generated.');
    loadData();
  };

  const handlePayment = async () => {
    setActionNotice('Processing Direct Benefit Transfer payout...');
    await api.completePayment("KF-2026-000123", "DBT payment cleared via PFMS portal");
    setActionNotice('✓ ₹83,905 marked completed! Farmer notified on SMS.');
    loadData();
  };

  const handleAdvanceCounter = async () => {
    setActionNotice('Advancing queue and calling next farmer...');
    await api.advanceCounter(1);
    setActionNotice('✓ Next farmer called to Counter 1!');
    loadData();
  };

  const handleVoiceAnnouncement = () => {
    const script = "लक्ष द्या: शेतकरी बांधव राजेश पवार, तुमचे टोकन KF-2026-000123 आता काउंटर क्रमांक १ वर बोलावले आहे. कृपया उपस्थित राहावे.";
    setVoiceScript(script);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    setActionNotice('🔊 Simulated automated yard loudspeaker announcement triggered!');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12 text-gray-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Officer Station Header */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-soft mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-3xl font-black shadow-xs shrink-0">
              👮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900">Procurement Officer Desk</h1>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                  OFF1001
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Sanjay Deshmukh • Pune APMC Center (Gultekdi)
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            className="self-end sm:self-auto p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition flex items-center gap-2 text-xs font-bold"
            title="Refresh Queue"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh Queue</span>
          </button>
        </div>

        {/* Top Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-gray-100 text-center">
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">Waiting in Yard</div>
            <div className="text-2xl font-black text-amber-950 mt-0.5">{queueData?.total_waiting || 12}</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
            <div className="text-[10px] text-blue-800 font-bold uppercase tracking-wider">Processing</div>
            <div className="text-2xl font-black text-blue-950 mt-0.5">{queueData?.total_processing || 3}</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
            <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Completed Today</div>
            <div className="text-2xl font-black text-emerald-950 mt-0.5">{queueData?.total_completed || 47}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100">
            <div className="text-[10px] text-purple-800 font-bold uppercase tracking-wider">Avg Wait Time</div>
            <div className="text-2xl font-black text-purple-950 mt-0.5">25m</div>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="p-3.5 mb-6 bg-emerald-600 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-soft flex items-center justify-between animate-in fade-in duration-200">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice('')} className="text-white/80 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* Responsive 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Primary Workflow Actions on Rajesh Pawar */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border-2 border-amber-500 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Active Farmer Token: KF-2026-000123
            </span>
            <span className="text-xs font-bold text-gray-500">Rajesh Baburao Pawar</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 mb-5">
            <div className="flex justify-between py-0.5">
              <span className="text-gray-500">Crop & Declared Weight:</span>
              <span className="font-extrabold text-gray-900">Wheat • 35.0 Quintals</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-gray-500">Official Procurement MSP:</span>
              <span className="font-extrabold text-green-800">₹2,425 / quintal</span>
            </div>
            <div className="flex justify-between py-0.5 border-t border-slate-200/80 pt-1.5 mt-1">
              <span className="text-gray-500">Calculated Payout:</span>
              <span className="font-black text-green-950 text-base">₹83,905 (for 34.6 Q)</span>
            </div>
          </div>

          {/* Step-by-Step Officer Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleVerify}
              className="w-full py-3.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-soft flex items-center justify-between transition active:scale-98"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>Step 1: Verify Farmer Documents (कागदपत्र पडताळणी)</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-700">Step 2: Enter Weighbridge Scale Weight (Q)</span>
                <span className="text-xs font-mono font-black text-emerald-800">{actualWeight} Q</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={actualWeight}
                  onChange={(e) => setActualWeight(parseFloat(e.target.value) || 0)}
                  className="w-1/2 px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleWeigh}
                  className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition active:scale-95"
                >
                  Log Weight & Procure
                </button>
              </div>
            </div>

            <button
              onClick={handleProcure}
              className="w-full py-3.5 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-soft flex items-center justify-between transition active:scale-98"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Step 3: Complete Procurement & Generate Receipt</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handlePayment}
              className="w-full py-4 px-4 bg-green-700 hover:bg-green-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-soft flex items-center justify-between transition active:scale-98"
            >
              <div className="flex items-center gap-2">
                <BadgeIndianRupee className="w-4 h-4" />
                <span>Step 4: Mark DBT Payment Completed (₹83,905)</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Counter Advance & Voice Alert Simulation */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={handleAdvanceCounter}
              className="py-3 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <span>Call Next Farmer</span>
            </button>

            <button
              onClick={handleVoiceAnnouncement}
              className="py-3 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Simulate Voice Alert</span>
            </button>
          </div>

        </div>

        {/* Right Column: Live Queue Table & Announcements */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-500">
                Today's Live Yard Queue
              </h2>
              <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
                Auto-Refreshing
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                    <th className="pb-2.5">Token</th>
                    <th className="pb-2.5">Farmer</th>
                    <th className="pb-2.5">Crop / Qty</th>
                    <th className="pb-2.5">Stage</th>
                    <th className="pb-2.5">Wait</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {queueData?.queue?.map((item: any) => (
                    <tr key={item.token_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 font-mono font-bold text-green-950">{item.token_id}</td>
                      <td className="py-2.5 font-bold">{item.farmer_name}</td>
                      <td className="py-2.5 text-xs">{item.crop} ({item.quantity} Q)</td>
                      <td className="py-2.5">
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                          {item.stage}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-500 font-bold text-xs">{item.wait_minutes || 25}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {voiceScript && (
            <div className="p-4 bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-soft text-xs space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Volume2 className="w-4 h-4" />
                <span>Automated Yard Announcement (Broadcasting):</span>
              </div>
              <p className="text-slate-300 italic font-serif">"{voiceScript}"</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
