import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Scale, FileText, BadgeIndianRupee, 
  Volume2, Search, ArrowRight, UserCheck, RefreshCw, AlertTriangle, 
  ShieldCheck, Radio, Check, Landmark, Sparkles, Building2, Truck
} from 'lucide-react';
import { api, TokenData } from '../services/api';
import { useRealtimeQueue } from '../hooks/useRealtimeQueue';

export const OfficerDashboard: React.FC = () => {
  const [queueData, setQueueData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToken, setSelectedToken] = useState<string>("KF-2026-000123");
  const [actualWeight, setActualWeight] = useState<number>(34.6);
  const [tareWeight, setTareWeight] = useState<number>(0.4);
  const [actionNotice, setActionNotice] = useState<string>('');
  const [voiceScript, setVoiceScript] = useState<string>('');
  const [stepCompleted, setStepCompleted] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: false,
    4: false
  });

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
    setStepCompleted(prev => ({ ...prev, 1: true }));
    setActionNotice('✓ Farmer 7/12 Land Records & Aadhaar Verified! Stage advanced to Weighbridge.');
    loadData();
  };

  const handleWeigh = async () => {
    setActionNotice(`Recording net weight ${actualWeight} Q on certified weighbridge...`);
    await api.recordWeighing("KF-2026-000123", actualWeight, "Measured on Electronic Scale #3");
    setStepCompleted(prev => ({ ...prev, 2: true }));
    setActionNotice(`✓ Actual Net Weight of ${actualWeight} Q certified & logged!`);
    loadData();
  };

  const handleProcure = async () => {
    setActionNotice('Completing procurement and generating official digital receipt...');
    await api.completeProcurement("KF-2026-000123", "FCI Quality standards satisfied");
    setStepCompleted(prev => ({ ...prev, 3: true }));
    setActionNotice('✓ Crop accepted! Government Receipt RCPT-2026-00123 generated.');
    loadData();
  };

  const handlePayment = async () => {
    setActionNotice('Processing Direct Benefit Transfer payout...');
    await api.completePayment("KF-2026-000123", "DBT payment cleared via PFMS portal");
    setStepCompleted(prev => ({ ...prev, 4: true }));
    setActionNotice('✓ ₹83,905 marked completed! Disbursed directly to farmer bank account.');
    loadData();
  };

  const handleAdvanceCounter = async () => {
    setActionNotice('Advancing queue and calling next farmer...');
    await api.advanceCounter(1);
    setActionNotice('✓ Next farmer called to Counter 1!');
    loadData();
  };

  const handleVoiceAnnouncement = () => {
    const script = "लक्ष द्या: शेतकरी बांधव राजेश पवार, तुमचे टोकन KF-2026-000123 आता काउंटर क्रमांक १ वर बोलावले आहे. कृपया वजन काट्यावर उपस्थित राहावे.";
    setVoiceScript(script);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    setActionNotice('🔊 Simulated automated yard loudspeaker announcement broadcast in Marathi!');
  };

  const mspRate = 2425;
  const calculatedPayout = Math.round(actualWeight * mspRate);

  const filteredQueue = queueData?.queue?.filter((item: any) => 
    item.token_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.farmer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.crop?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F8F5] via-[#FAF7F0] to-[#EFF5F0] text-gray-900 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Officer Station Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-emerald-200/90 shadow-soft mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-emerald-50 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-white flex items-center justify-center text-3xl font-black shadow-soft shrink-0 ring-4 ring-amber-100">
              👮
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Procurement Officer Workstation
                </h1>
                <span className="text-[11px] font-black bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full border border-amber-300">
                  OFF1001 • Terminal #1
                </span>
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Weighbridge Online
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center gap-2">
                <span>Officer Sanjay Deshmukh</span>
                <span>•</span>
                <span className="font-semibold text-emerald-950">Pune Agriculture Procurement Center (APMC Gultekdi Mandi)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-center">
            <button
              onClick={handleAdvanceCounter}
              className="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black rounded-xl text-xs shadow-soft flex items-center gap-1.5 active:scale-95 transition"
            >
              <Users className="w-4 h-4" />
              <span>Call Next Farmer</span>
            </button>

            <button
              onClick={handleVoiceAnnouncement}
              className="py-2.5 px-3.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-xs shadow-soft flex items-center gap-1.5 active:scale-95 transition"
              title="Broadcast Yard Announcement"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>PA Audio</span>
            </button>

            <button
              onClick={loadData}
              className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition"
              title="Refresh Queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Operational Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-gray-100 text-center">
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 shadow-xs">
            <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">Waiting In Yard</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-950 mt-0.5">{queueData?.total_waiting || 12}</div>
            <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Tractors & Carts in queue</div>
          </div>

          <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200/80 shadow-xs">
            <div className="text-[10px] text-blue-800 font-bold uppercase tracking-wider">Processing Lot</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-950 mt-0.5">{queueData?.total_processing || 3}</div>
            <div className="text-[10px] text-blue-700 font-semibold mt-0.5">At weighing & grading</div>
          </div>

          <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80 shadow-xs">
            <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Completed Today</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-0.5">{queueData?.total_completed || 47}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">₹1.18 Cr Disbursed via DBT</div>
          </div>

          <div className="bg-purple-50/80 p-3.5 rounded-2xl border border-purple-200/80 shadow-xs">
            <div className="text-[10px] text-purple-800 font-bold uppercase tracking-wider">Avg Wait Time</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-950 mt-0.5">25m</div>
            <div className="text-[10px] text-purple-700 font-semibold mt-0.5">Optimal pace &lt; 30m</div>
          </div>
        </div>

      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="p-4 mb-6 bg-gradient-to-r from-emerald-700 to-green-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-soft flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice('')} className="text-white/80 hover:text-white ml-2 text-base font-bold">✕</button>
        </div>
      )}

      {/* Responsive 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Session Console */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-600/70 shadow-token">
            
            {/* Header with Active Token */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  Active Session • Counter 1
                </span>
                <div className="text-2xl font-black font-mono text-green-950 mt-2">
                  KF-2026-000123
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-gray-900">Rajesh Baburao Pawar</div>
                <div className="text-[11px] text-gray-500 font-mono">FARM1001 • Shivane, Pune</div>
              </div>
            </div>

            {/* Electronic Weighbridge LED Screen */}
            <div className="my-5 p-5 bg-[#0B1510] rounded-2xl border-2 border-emerald-500/40 shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400/80 mb-2">
                <span>CERTIFIED SCALE #3 (DIGITAL WEIGHBRIDGE)</span>
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE CALIBRATED
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono tracking-widest">Net Certified Weight</div>
                  <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]">
                    {actualWeight.toFixed(1)} <span className="text-2xl text-emerald-500 font-normal">Q</span>
                  </div>
                </div>
                
                <div className="text-right space-y-1 text-xs font-mono">
                  <div className="text-gray-400">Gross: <span className="text-white font-bold">{(actualWeight + tareWeight).toFixed(1)} Q</span></div>
                  <div className="text-gray-400">Tare: <span className="text-amber-400 font-bold">{tareWeight.toFixed(1)} Q</span></div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-emerald-900/60 flex items-center justify-between text-[11px] text-emerald-200/80 font-mono">
                <span>FCI Grade: <strong>Grade A (Premium)</strong></span>
                <span>Moisture: <strong>11.2% (Norm &lt; 12%)</strong></span>
              </div>
            </div>

            {/* Payout Summary Strip */}
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs sm:text-sm space-y-1.5 mb-5">
              <div className="flex justify-between py-0.5">
                <span className="text-gray-600">Crop & Declared Quantity:</span>
                <span className="font-extrabold text-gray-900">Wheat (गहू) • 35.0 Q</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-gray-600">Government MSP Rate:</span>
                <span className="font-extrabold text-green-800">₹{mspRate.toLocaleString('en-IN')} / Quintal</span>
              </div>
              <div className="flex justify-between py-1 border-t border-emerald-200 pt-2 mt-1">
                <span className="text-gray-700 font-bold">Total Disbursable Amount:</span>
                <span className="font-black text-green-950 text-base sm:text-lg font-mono">
                  ₹{calculatedPayout.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 4-Step Interactive Officer Workflow */}
            <div className="space-y-3">
              
              {/* Step 1: Document Verification */}
              <button
                onClick={handleVerify}
                className="w-full py-3.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-soft flex items-center justify-between transition active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-5 h-5 text-blue-200" />
                  <span>Step 1: Verify 7/12 Land & Aadhaar Records</span>
                </div>
                {stepCompleted[1] ? (
                  <span className="px-2 py-0.5 rounded-full bg-blue-900 text-blue-100 text-[10px] font-bold">Verified ✓</span>
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>

              {/* Step 2: Scale Input & Weighing */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-800">Step 2: Calibrated Weight Scale Input (Net Q)</span>
                  <span className="text-xs font-mono font-black text-emerald-800">{actualWeight} Q</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={actualWeight}
                    onChange={(e) => setActualWeight(parseFloat(e.target.value) || 0)}
                    className="w-1/2 px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                  <button
                    onClick={handleWeigh}
                    className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Scale className="w-4 h-4" />
                    <span>Certify Net Weight</span>
                  </button>
                </div>
              </div>

              {/* Step 3: Procurement & Receipt */}
              <button
                onClick={handleProcure}
                className="w-full py-3.5 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-soft flex items-center justify-between transition active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-purple-200" />
                  <span>Step 3: Complete Procurement & Issue Government Receipt</span>
                </div>
                {stepCompleted[3] ? (
                  <span className="px-2 py-0.5 rounded-full bg-purple-900 text-purple-100 text-[10px] font-bold">Issued ✓</span>
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>

              {/* Step 4: DBT Payment Release */}
              <button
                onClick={handlePayment}
                className="w-full py-4 px-4 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-soft-lg flex items-center justify-between transition active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <BadgeIndianRupee className="w-5 h-5 text-emerald-200" />
                  <span>Step 4: Release DBT Payout (₹{calculatedPayout.toLocaleString('en-IN')})</span>
                </div>
                {stepCompleted[4] ? (
                  <span className="px-2.5 py-1 rounded-full bg-white text-emerald-900 text-[10px] font-black">Disbursed ✓</span>
                ) : (
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                )}
              </button>

            </div>

          </div>

          {/* PA Announcement Status */}
          {voiceScript && (
            <div className="p-4 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-soft text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>Automated Yard Announcement (PA Speaker Broadcasting):</span>
              </div>
              <p className="text-slate-300 italic font-serif leading-relaxed">"{voiceScript}"</p>
            </div>
          )}

        </div>

        {/* Right Column: Live Queue Table & Mandi Terminal Overview */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-black text-gray-900">
                  Live Mandi Yard Queue
                </h2>
                <p className="text-xs text-gray-500">Real-time virtual token sequence at Pune APMC</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-48">
                <input
                  type="text"
                  placeholder="Search token / farmer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Token</th>
                    <th className="pb-3">Farmer</th>
                    <th className="pb-3">Crop / Qty</th>
                    <th className="pb-3">Stage</th>
                    <th className="pb-3">Wait</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredQueue.map((item: any) => (
                    <tr 
                      key={item.token_id} 
                      className={`hover:bg-slate-50 transition-colors ${
                        item.token_id === selectedToken ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      <td className="py-3 font-mono font-bold text-green-950">{item.token_id}</td>
                      <td className="py-3 font-bold text-gray-900">{item.farmer_name}</td>
                      <td className="py-3 text-xs text-gray-600">{item.crop} ({item.quantity} Q)</td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          item.stage === 'weighing' 
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : item.stage === 'completed'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-blue-50 text-blue-900 border-blue-200'
                        }`}>
                          {item.stage}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500 font-bold text-xs">{item.wait_minutes || 25}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mandi Yard Status Cards */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 bg-white rounded-3xl border border-gray-200 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800 mb-1">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Vehicle Unloading Bay</span>
              </div>
              <div className="text-xl font-black text-gray-900">Bay 1 & Bay 2 Active</div>
              <p className="text-[10px] text-gray-500 mt-0.5">Average offloading time: 14 mins / lot</p>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-gray-200 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800 mb-1">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>Godown Storage Capacity</span>
              </div>
              <div className="text-xl font-black text-gray-900">78% Available</div>
              <p className="text-[10px] text-gray-500 mt-0.5">FCI Central Silo • Gultekdi</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
