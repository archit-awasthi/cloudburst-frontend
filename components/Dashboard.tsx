
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, TooltipProps } from 'recharts';
import { Clock, MousePointerClick, TrendingUp, AlertCircle, RefreshCw, Server } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

// Fallback/Demo Data
const MOCK_CATEGORY_DATA = [
  { name: 'Social Media', value: 45, color: '#FF8C42' },
  { name: 'Productivity', value: 30, color: '#3B82F6' },
  { name: 'Entertainment', value: 15, color: '#10B981' },
  { name: 'News', value: 10, color: '#8B5CF6' },
];

const MOCK_ACTIVITY_DATA = [
  { name: 'Mon', hours: 4.2 },
  { name: 'Tue', hours: 6.5 },
  { name: 'Wed', hours: 5.1 },
  { name: 'Thu', hours: 3.8 },
  { name: 'Fri', hours: 7.2 },
  { name: 'Sat', hours: 8.5 },
  { name: 'Sun', hours: 6.0 },
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-gray border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-white font-medium mb-1">{label}</p>
          <p className="text-brand-orange text-sm">
            {payload[0].value} hours
          </p>
        </div>
      );
    }
    return null;
  };

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(true);
  const [categoryData, setCategoryData] = useState(MOCK_CATEGORY_DATA);
  const [activityData, setActivityData] = useState(MOCK_ACTIVITY_DATA);
  const [stats, setStats] = useState({
    totalScreenTime: "42.3 hrs",
    mostVisited: "youtube.com",
    visits: "142",
    leakage: "18.5 hrs"
  });

  useEffect(() => {
    const fetchData = async () => {
      // Basic check for query params if you implement user specific reports later (e.g. ?uid=123)
      // const urlParams = new URLSearchParams(window.location.search);
      // const uid = urlParams.get('uid'); 
      
      setLoading(true);
      try {
        console.log(`Connecting to ${API_ENDPOINTS.REPORT}...`);
        const response = await fetch(API_ENDPOINTS.REPORT);
        
        if (response.ok) {
          const data = await response.json();
          // Assuming the backend returns a structure similar to our state.
          // You would map real data here.
          if (data.categoryData) setCategoryData(data.categoryData);
          if (data.activityData) setActivityData(data.activityData);
          if (data.stats) setStats(data.stats);
          setUsingDemoData(false);
        } else {
          console.warn("Backend reachable but returned error, using demo data.");
        }
      } catch (error) {
        console.log("Could not fetch backend data (likely CORS or endpoint mismatch), using demo data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-brand-orange space-y-4">
        <RefreshCw className="animate-spin" size={48} />
        <div className="flex items-center gap-2 text-brand-cream animate-pulse">
            <Server size={18} />
            <span>Connecting to CloudBurst Secure Server...</span>
        </div>
        <p className="text-xs text-gray-500">This might take a moment if the server is waking up.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-black animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Your Digital Pulse</h2>
            <p className="text-gray-400">Analysis based on last 7 days of activity</p>
          </div>
          <div className="flex items-center gap-4">
             {usingDemoData && (
                <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded border border-white/5">
                  Demo Data
                </span>
             )}
            <div className="px-4 py-2 bg-brand-orange/10 border border-brand-orange/30 rounded-lg text-brand-orange flex items-center gap-2">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">High Usage Detected</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-gray/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Screen Time</p>
                <h3 className="text-2xl font-bold text-white">{stats.totalScreenTime}</h3>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="text-red-400 mr-1">↑ 12%</span> vs last week
            </div>
          </div>

          <div className="bg-brand-gray/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                <MousePointerClick size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Most Visited</p>
                <h3 className="text-2xl font-bold text-white">{stats.mostVisited}</h3>
              </div>
            </div>
             <div className="text-xs text-gray-500 mt-2">
              <span className="text-gray-400">{stats.visits} visits</span> this week
            </div>
          </div>

          <div className="bg-brand-gray/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-brand-orange/20 rounded-lg text-brand-orange">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Time Leakage</p>
                <h3 className="text-2xl font-bold text-white">{stats.leakage}</h3>
              </div>
            </div>
             <div className="text-xs text-gray-500 mt-2">
              Time spent on doom-scrolling sites
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Category Distribution */}
          <div className="bg-brand-gray/20 p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-semibold mb-6 text-white">Category Distribution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Activity */}
          <div className="bg-brand-gray/20 p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-semibold mb-6 text-white">Daily Usage (Hours)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#555" 
                    tick={{fill: '#888', fontSize: 12}} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#555" 
                    tick={{fill: '#888', fontSize: 12}} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="hours" fill="#FF8C42" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
