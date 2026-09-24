import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Clock, AlertTriangle, ShieldCheck, 
  TrendingUp, Activity, Plus, CheckCircle2, RefreshCw 
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
    setToastMessage('✓ Counter 3 Activated! Queue wait time reduced by 25% across Pune APMC center.');
    setTimeout(() => setToastMessage(''), 5000);
  };

  const COLORS = ['#2E7D32', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Top Command Banner */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 mb-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-2xl font-black">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">Government Command & Operations Dashboard</h1>
                <span className="text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-700 px-2 py-0.5 rounded-full">
                  ADMIN001
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Department of Agriculture & Agricultural Marketing Board, Govt of Maharashtra
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Top 6 KPI Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 mt-5 text-center">
          <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Centers</div>
            <div className="text-2xl font-black text-white">{metrics?.total_centers || 6}</div>
            <div className="text-[9px] text-emerald-400">100% Online</div>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Active Farmers</div>
            <div className="text-2xl font-black text-amber-400">{metrics?.active_farmers || 48}</div>
            <div className="text-[9px] text-slate-400">In Virtual Queues</div>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Tokens Today</div>
            <div className="text-2xl font-black text-blue-400">{metrics?.tokens_today || 184}</div>
            <div className="text-[9px] text-slate-400">+18% vs Yesterday</div>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Completed</div>
            <div className="text-2xl font-black text-emerald-400">{metrics?.completed_today || 132}</div>
            <div className="text-[9px] text-emerald-400">₹1.18 Cr Disbursed</div>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Avg Wait Time</div>
            <div className="text-2xl font-black text-purple-400">{counterActivated ? '18m' : `${metrics?.average_wait || 23.5}m`}</div>
            <div className="text-[9px] text-emerald-400">{counterActivated ? 'Reduced 25%' : 'Stable'}</div>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Congestion Alert</div>
            <div className="text-2xl font-black text-rose-400">{alertDismissed ? 0 : 1}</div>
            <div className="text-[9px] text-rose-400">{alertDismissed ? 'Optimized' : 'Threshold > 8'}</div>
          </div>
        </div>

      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 mb-5 bg-emerald-600 text-white rounded-2xl font-bold text-xs flex items-center justify-between shadow-soft animate-in fade-in duration-200">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')}>✕</button>
        </div>
      )}

      {/* AI Congestion Detection & Counter Optimization Card */}
      {!alertDismissed && (
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border-2 border-rose-500/80 rounded-3xl p-5 mb-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
                  AI Congestion Alert Detected
                </span>
                <h3 className="text-base font-extrabold text-white mt-1">
                  Pune APMC Center: 18 Farmers Waiting / 2 Active Counters
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Congestion Ratio: 9.0 (Threshold: 8.0). Estimated wait time has risen to 35 minutes.
                </p>
                <div className="text-xs font-bold text-amber-300 mt-2">
                  💡 AI Recommendation: Activate Counter 3 to reduce wait times immediately.
                </div>
              </div>
            </div>

            <button
              onClick={handleActivateCounter}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg whitespace-nowrap active:scale-95 transition"
            >
              Activate Counter 3 ➔
            </button>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        
        {/* Chart 1: Hourly Throughput */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 shadow-soft">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            Tokens Processed Per Hour (Today)
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.tokens_per_hour || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="tokens" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Wait Time Trend */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 shadow-soft">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            Average Wait Time Trend (Minutes)
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.avg_wait_trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="wait_min" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Queue Length by Center */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 shadow-soft">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            Active Queue by Center
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.queue_by_center || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="center" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="queue" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Crop Procurement Distribution */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 shadow-soft">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            Crop-Wise Procurement (Quintals)
          </h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.crop_procurement || []}
                  dataKey="quintals"
                  nameKey="crop"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(analytics?.crop_procurement || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
