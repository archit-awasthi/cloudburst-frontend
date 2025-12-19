
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Clock, RefreshCw, Server, ShieldCheck, AlertTriangle, Globe, ArrowUpRight } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

interface DashboardProps {
  reportId?: string | null;
}

interface HistoryEntry {
  url: string;
  title: string;
  domain: string;
  visitCount: number;
  lastVisitTime: number;
}

interface DashboardStats {
  totalScreenTime: string;
  totalVisits: number;
  topDomains: { domain: string; visits: number }[];
}

// --- Helper Functions for Data Processing ---

const ESTIMATED_MINUTES_PER_VISIT = 3; // Heuristic for screen time calculation

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Social Media': ['facebook', 'twitter', 'instagram', 'linkedin', 'reddit', 'youtube', 'tiktok', 'pinterest', 'discord', 'whatsapp', 'telegram', 'x.com'],
  'Productivity': ['google', 'gmail', 'docs', 'sheets', 'slides', 'notion', 'slack', 'github', 'gitlab', 'linear', 'figma', 'trello', 'asana', 'zoom', 'meet', 'microsoft', 'office', 'canva', 'chatgpt', 'openai', 'claude', 'v0'],
  'Entertainment': ['netflix', 'hulu', 'twitch', 'spotify', 'disney', 'hbo', 'primevideo', 'steam', 'roblox', '9gag', 'imdb'],
  'News & Reading': ['cnn', 'bbc', 'nytimes', 'forbes', 'bloomberg', 'medium', 'substack', 'wikipedia', 'news', 'weather', 'espn'],
  'Shopping': ['amazon', 'ebay', 'etsy', 'shopify', 'walmart', 'target', 'bestbuy', 'nike']
};

const getCategory = (domain: string): string => {
  const lowerDomain = domain.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lowerDomain.includes(k))) {
      return category;
    }
  }
  return 'Other';
};

const CATEGORY_COLORS: Record<string, string> = {
  'Social Media': '#FF8C42', // Brand Orange
  'Productivity': '#3B82F6', // Blue
  'Entertainment': '#10B981', // Green
  'News & Reading': '#8B5CF6', // Purple
  'Shopping': '#F59E0B', // Amber
  'Other': '#6B7280' // Gray
};

// --- Component ---

// Simplified tooltip to avoid type errors
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-gray border border-white/10 p-3 rounded-lg shadow-xl z-50">
        <p className="text-white font-medium mb-1">{label}</p>
        <p className="text-brand-orange text-sm">
          {payload[0].value} hrs
        </p>
      </div>
    );
  }
  return null;
};

const DEMO_DATA = {
  categoryData: [
    { name: 'Social Media', value: 45, color: '#FF8C42' },
    { name: 'Productivity', value: 30, color: '#3B82F6' },
    { name: 'Entertainment', value: 15, color: '#10B981' },
    { name: 'News', value: 10, color: '#8B5CF6' },
  ],
  activityData: [
    { name: 'Mon', hours: 4.2 },
    { name: 'Tue', hours: 6.5 },
    { name: 'Wed', hours: 5.1 },
    { name: 'Thu', hours: 3.8 },
    { name: 'Fri', hours: 7.2 },
    { name: 'Sat', hours: 8.5 },
    { name: 'Sun', hours: 6.0 },
  ],
  stats: {
    totalScreenTime: "42.3",
    totalVisits: 1240,
    topDomains: [
      { domain: 'youtube.com', visits: 142 },
      { domain: 'github.com', visits: 89 },
      { domain: 'google.com', visits: 65 },
      { domain: 'twitter.com', visits: 45 },
      { domain: 'reddit.com', visits: 32 }
    ]
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ reportId }) => {
  const [loading, setLoading] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [categoryData, setCategoryData] = useState(DEMO_DATA.categoryData);
  const [activityData, setActivityData] = useState(DEMO_DATA.activityData);
  const [stats, setStats] = useState<DashboardStats>(DEMO_DATA.stats);

  // Normalize data helper to handle potential snake_case from backend
  const normalizeData = (data: any) => {
    if (!data) return [];
    // If it's already an array, return it
    if (Array.isArray(data)) return data;
    // Check for common wrapper keys
    if (Array.isArray(data.entries)) return data.entries;
    if (Array.isArray(data.history)) return data.history;
    if (Array.isArray(data.data)) return data.data;
    return [];
  };

  useEffect(() => {
    if (!reportId) {
      setUsingDemoData(true);
      setCategoryData(DEMO_DATA.categoryData);
      setActivityData(DEMO_DATA.activityData);
      setStats(DEMO_DATA.stats);
      return;
    }

    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const url = API_ENDPOINTS.GET_REPORT(reportId);
        console.log(`Fetching report: ${url}`);
        
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Report not found' : 'Failed to load report');
        }

        const rawData = await res.json();
        console.log("Raw backend response:", rawData);

        const entries = normalizeData(rawData);
        
        if (entries.length > 0) {
          processHistoryData(entries);
          setUsingDemoData(false);
        } else {
           setError("Report found but contains no history data.");
        }

      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const processHistoryData = (entries: any[]) => {
    // Clean and normalize entries
    const cleanEntries: HistoryEntry[] = entries.map(e => ({
      url: e.url || '',
      title: e.title || 'Unknown Page',
      domain: e.domain || (e.url ? new URL(e.url).hostname : 'unknown'),
      visitCount: parseInt(e.visitCount || e.visit_count || '1', 10),
      lastVisitTime: parseFloat(e.lastVisitTime || e.last_visit_time || Date.now())
    }));

    // 1. Calculate Totals
    const totalVisits = cleanEntries.reduce((acc, item) => acc + item.visitCount, 0);
    const estimatedTotalMinutes = totalVisits * ESTIMATED_MINUTES_PER_VISIT;
    const totalHours = (estimatedTotalMinutes / 60).toFixed(1);

    // 2. Top 5 Domains
    const domainVisits: Record<string, number> = {};
    cleanEntries.forEach(e => {
      if (!e.domain) return;
      domainVisits[e.domain] = (domainVisits[e.domain] || 0) + e.visitCount;
    });

    const topDomains = Object.entries(domainVisits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([domain, visits]) => ({ domain, visits }));

    // 3. Categorization (Pie Chart)
    const categoryCounts: Record<string, number> = {};

    cleanEntries.forEach(e => {
      if (!e.domain) return;
      const cat = getCategory(e.domain);
      const visits = e.visitCount;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + visits;
    });

    const processedCategories = Object.entries(categoryCounts)
      .map(([name, value]) => ({
        name,
        value, // This is visit count, which effectively represents relative time
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS['Other']
      }))
      .sort((a, b) => b.value - a.value);

    // 4. Activity by Day (Bar Chart)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCounts = new Array(7).fill(0);

    cleanEntries.forEach(e => {
      if (e.lastVisitTime) {
        const dayIndex = new Date(e.lastVisitTime).getDay(); // 0 = Sun
        dayCounts[dayIndex] += (e.visitCount * ESTIMATED_MINUTES_PER_VISIT) / 60; // Add hours
      }
    });

    // Reorder Mon(1) to Sat(6), then Sun(0) at end
    const orderedDays = [];
    for (let i = 1; i <= 6; i++) {
      orderedDays.push({ name: days[i], hours: parseFloat(dayCounts[i].toFixed(1)) });
    }
    orderedDays.push({ name: days[0], hours: parseFloat(dayCounts[0].toFixed(1)) });

    // 5. Update State
    setStats({
      totalScreenTime: totalHours,
      totalVisits: totalVisits,
      topDomains: topDomains
    });

    setCategoryData(processedCategories);
    setActivityData(orderedDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-brand-orange space-y-4">
        <RefreshCw className="animate-spin" size={48} />
        <div className="flex items-center gap-2 text-brand-cream animate-pulse">
            <Server size={18} />
            <span>Analyzing Report Data...</span>
        </div>
        <p className="text-xs text-gray-500">ID: {reportId}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-black px-4 text-center">
        <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 max-w-md w-full flex flex-col items-center">
            <AlertTriangle size={48} className="text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Unable to Load Report</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="mt-6 pt-6 border-t border-white/10 w-full text-center">
                <a href="/" className="text-brand-orange hover:underline text-sm">Return to Home</a>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-black animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {usingDemoData ? "Digital Pulse (Demo)" : "Your Analysis"}
            </h2>
            <div className="flex items-center gap-2 text-gray-400">
                {usingDemoData ? (
                    <span>Based on sample data</span>
                ) : (
                    <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">Report ID: {reportId}</span>
                )}
            </div>
          </div>
          <div className="flex items-center gap-4">
             {usingDemoData && (
                <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded border border-white/5">
                  Demo Mode
                </span>
             )}
             {!usingDemoData && (
               <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20 flex items-center gap-1">
                 <ShieldCheck size={12} /> Live Report
               </span>
             )}
          </div>
        </div>

        {/* Top Section: Screen Time & Top Sites */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Stat: Total Screen Time */}
          <div className="lg:col-span-1 bg-brand-gray/30 p-8 rounded-2xl border border-white/5 backdrop-blur-sm flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock size={100} className="text-brand-orange" />
            </div>
            <div className="relative z-10">
              <p className="text-gray-400 font-medium mb-2">Total Screen Time</p>
              <h3 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                {stats.totalScreenTime}<span className="text-2xl text-gray-500 ml-2">hrs</span>
              </h3>
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 bg-black/20 w-fit px-3 py-1.5 rounded-full">
                <RefreshCw size={12} />
                <span>Last 30 Days</span>
              </div>
            </div>
          </div>

          {/* Top 5 Visited Sites */}
          <div className="lg:col-span-2 bg-brand-gray/20 p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Globe size={18} className="text-brand-orange" />
              Top 5 Visited Websites
            </h3>
            <div className="overflow-hidden">
              <div className="grid grid-cols-12 text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">
                <div className="col-span-1">#</div>
                <div className="col-span-8">Domain</div>
                <div className="col-span-3 text-right">Visits</div>
              </div>
              <div className="space-y-2">
                {stats.topDomains.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="col-span-1 font-mono text-brand-orange/70">0{index + 1}</div>
                    <div className="col-span-8 font-medium text-white truncate flex items-center gap-2">
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=32`} 
                        alt="" 
                        className="w-4 h-4 rounded-sm opacity-70"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      {item.domain}
                    </div>
                    <div className="col-span-3 text-right text-gray-300 font-mono">{item.visits}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Weekly Activity */}
          <div className="bg-brand-gray/20 p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
               Weekly Activity <span className="text-sm font-normal text-gray-500 ml-2">(Hours)</span>
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#555" 
                    tick={{fill: '#888', fontSize: 12}} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#555" 
                    tick={{fill: '#888', fontSize: 12}} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{fill: 'rgba(255,140,66,0.1)', radius: 4}} 
                  />
                  <Bar 
                    dataKey="hours" 
                    fill="#FF8C42" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40} 
                    activeBar={{ fill: '#FF6B00' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-brand-gray/20 p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-semibold mb-6 text-white">Category Distribution</h3>
            {categoryData.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="h-[250px] w-[250px] relative">
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
                          <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                     <span className="text-2xl font-bold text-white">{stats.totalVisits}</span>
                     <p className="text-[10px] text-gray-500 uppercase tracking-wide">Visits</p>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex-1 w-full grid grid-cols-2 gap-3">
                  {categoryData.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-300 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-lg">
                Not enough data to categorize
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
