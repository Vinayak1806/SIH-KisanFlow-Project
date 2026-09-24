import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Clock, AlertTriangle, ShieldCheck, 
  TrendingUp, Activity, Plus, CheckCircle2, RefreshCw, 
  Radio, Cpu, Globe, ArrowUpRight, Check, Zap, Layers
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';
import { api } from '../services/api';
import { useRealtimeQueue } from '../hooks/useRealtimeQueue';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [counterActivated, setCounterActivated] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { lastEvent } = useRealtimeQueue(1);

  const loadData = async () => {
    const d = await api.getAdminDashboard();
    setMetrics(d);
    const a = await api.getAdminAnalytics();
    setAnalytics(a);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleActivateCounter = async () => {
    await api.activateCounter(3);
    setCounterActivated(true);
    setAlertDismissed(true);
    setToastMessage('✓ Automated Load-Balancing: Counter 3 Activated at Pune APMC Yard! Average wait time reduced by 25%.');
    setTimeout(() => setToastMessage(''), 5000);
  };

  const mandiCenters = [
    { name: "Pune APMC Market Yard (Gultekdi)", district: "Pune", counters: counterActivated ? 3 : 2, queue: counterActivated ? 12 : 18, wait: counterActivated ? "18m" : "35m", status: "Optimal", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { name: "Baramati Kisan Sahakari Mandi", district: "Pune", counters: 2, queue: 8, wait: "16m", status: "Normal", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { name: "Junnar Krishi Utpanna Bajar", district: "Pune", counters: 2, queue: 11, wait: "22m", status: "Normal", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { name: "Shirur APMC Procurement Center", district: "Pune", counters: 2, queue: 6, wait: "14m", status: "Fast", badge: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    { name: "Daund Taluka Mandi Yard", district: "Pune", counters: 2, queue: 4, wait: "10m", status: "Fast", badge: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    { name: "Khed APMC Yard (Rajgurunagar)", district: "Pune", counters: 2, queue: 5, wait: "12m", status: "Fast", badge: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#09111E] via-[#0D1B2A] to-[#0A131F] text-slate-100 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Top Command Banner */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-7 mb-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-40 bg-gradient-to-l from-emerald-500/10 via-blue-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/20 border border-blue-400/30 shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  State Procurement Command & Operations Center
                </h1>
                <span className="text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-700/80 px-2.5 py-0.5 rounded-full">
                  ADMIN001
                </span>
                <span className="text-[10px] font-bold bg-emerald-900/50 text-emerald-300 border border-emerald-600/50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  National e-NAM Gateway Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Department of Agriculture & Maharashtra State Agricultural Marketing Board (MSAMB)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="px-3.5 py-2.5 bg-slate-700/80 hover:bg-slate-700 rounded-xl text-slate-300 border border-slate-600 transition flex items-center gap-2 text-xs font-bold active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Live Nodes</span>
            </button>
          </div>

        </div>

        {/* Top 6 KPI Stat Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-700/70 text-center">
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60 shadow-xs">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Centers</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">{metrics?.total_centers || 6}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">100% Online</div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60 shadow-xs">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Farmers</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5">{metrics?.active_farmers || 48}</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">In Virtual Queues</div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60 shadow-xs">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tokens Today</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-0.5">{metrics?.tokens_today || 184}</div>
            <div className="text-[10px] text-blue-300 font-semibold mt-0.5">+18% vs Yesterday</div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60 shadow-xs">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Settled (DBT)</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">{metrics?.completed_today || 132}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">₹1.18 Cr Cleared</div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60 shadow-xs">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Avg Wait Time</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-0.5">
              {counterActivated ? '18m' : `${metrics?.average_wait || 23.5}m`}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              {counterActivated ? 'Reduced 25% ✓' : 'Under Control'}
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60 shadow-xs">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Congestion Alert</div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-0.5">{alertDismissed ? 0 : 1}</div>
            <div className="text-[10px] text-rose-400 font-semibold mt-0.5">
              {alertDismissed ? 'Optimal Pace' : 'Action Recommended'}
            </div>
          </div>
        </div>

      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-white/80 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* AI Congestion Detection & Counter Optimization Card */}
      {!alertDismissed && (
        <div className="bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-900 border-2 border-rose-500/80 rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                  AI Dynamic Balancing Alert
                </span>
                <h3 className="text-base font-extrabold text-white mt-1">
                  Pune APMC Yard: 18 Farmers Waiting with 2 Active Counters
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Congestion Ratio: 9.0 (Safety Threshold: 8.0). Estimated wait time has reached 35 minutes.
                </p>
                <div className="text-xs font-bold text-amber-300 mt-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>AI Automated Recommendation: Activate Counter 3 to reduce wait times immediately.</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleActivateCounter}
              className="px-5 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg whitespace-nowrap active:scale-95 transition flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <span>Activate Counter 3 Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}

      {/* 4 Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Chart 1: Hourly Throughput */}
        <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-6 shadow-soft backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Tokens Processed Per Hour (Today)
            </h3>
            <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              Peak: 11 AM – 1 PM
            </span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.tokens_per_hour || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, fontSize: 11, color: '#f8fafc' }} />
                <Bar dataKey="tokens" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Wait Time Trend */}
        <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-6 shadow-soft backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Average Wait Time Curve (Minutes)
            </h3>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              AI Forecasted Trend
            </span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.avg_wait_trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, fontSize: 11, color: '#f8fafc' }} />
                <Line type="monotone" dataKey="wait_min" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: '#F59E0B' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Active Queue by Center */}
        <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-6 shadow-soft backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Active Virtual Queue by Mandi Center
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Live Mandi Data
            </span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.queue_by_center || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="center" type="category" stroke="#94a3b8" fontSize={10} width={95} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, fontSize: 11, color: '#f8fafc' }} />
                <Bar dataKey="queue" fill="#10B981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Crop Procurement Distribution */}
        <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-6 shadow-soft backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Crop-Wise Procurement (Quintals)
            </h3>
            <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              MSP Commodities
            </span>
          </div>
          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.crop_procurement || []}
                  dataKey="quintals"
                  nameKey="crop"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={35}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(analytics?.crop_procurement || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, fontSize: 11, color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* APMC Mandi Network Health Matrix */}
      <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-6 shadow-soft backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-black text-white">APMC Mandi Network Live Status Matrix</h2>
            <p className="text-xs text-slate-400">Live health, active counters, and throughput across district procurement yards</p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            6 of 6 Centers Online
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-700/80 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Center Name</th>
                <th className="pb-3">District</th>
                <th className="pb-3">Active Counters</th>
                <th className="pb-3">Queue Count</th>
                <th className="pb-3">Est. Wait</th>
                <th className="pb-3">Yard Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {mandiCenters.map((c, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-bold text-white">{c.name}</td>
                  <td className="py-3 text-slate-400">{c.district}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-700 font-bold text-slate-200 text-xs">
                      {c.counters} Counters
                    </span>
                  </td>
                  <td className="py-3 font-bold text-amber-400">{c.queue} farmers</td>
                  <td className="py-3 font-bold text-slate-300">{c.wait}</td>
                  <td className="py-3">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${c.badge}`}>
                      ● {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
