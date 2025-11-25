
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Clock, MousePointerClick, TrendingUp, AlertCircle, RefreshCw, Server, ShieldCheck, AlertTriangle } from 'lucide-react';
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
    totalScreenTime: "42.3 hrs",
    mostVisited: "youtube.com",
    visits: "142",
    leakage: "18.5 hrs"
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ reportId }) => {
  const [loading, setLoading] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [categoryData, setCategoryData] = useState(DEMO_DATA.categoryData);
  const [activityData, setActivityData] = useState(DEMO_DATA.activityData);
  const [stats, setStats] = useState(DEMO_DATA.stats);

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

        const data = await res.json();
        
        if (data.entries && Array.isArray(data.entries) && data.entries.length > 0) {
          processHistoryData(data.entries);
          setUsingDemoData(false);
        } else if (data.entries && data.entries.length === 0) {
           setError("Report found but contains no history data.");
        } else {
           // If backend returns other format (unlikely based on prompt, but safety first)
           setError("Invalid data format received.");
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

  const processHistoryData = (entries: HistoryEntry[]) => {
    // 1. Calculate Totals
    const totalVisits = entries.reduce((acc, item) => acc + (item.visitCount || 1), 0);
    const estimatedTotalMinutes = totalVisits * ESTIMATED_MINUTES_PER_VISIT;
    const totalHours = (estimatedTotalMinutes / 60).toFixed(1);

    // 2. Find Most Visited Domain
    const domainVisits: Record<string, number> = {};
    entries.forEach(e => {
      if (!e.domain) return;
      domainVisits[e.domain] = (domainVisits[e.domain] || 0) + (e.visitCount || 1);
    });

    const sortedDomains = Object.entries(domainVisits).sort(([, a], [, b]) => b - a);
    const topDomain = sortedDomains.length > 0 ? sortedDomains[0][0] : 'N/A';

    // 3. Categorization (Pie Chart)
    const categoryCounts: Record<string, number> = {};
    let leakageMinutes = 0;

    entries.forEach(e => {
      if (!e.domain) return;
      const cat = getCategory(e.domain);
      const visits = e.visitCount || 1;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + visits;

      // Define "Leakage" as Social or Entertainment
      if (cat === 'Social Media' || cat === 'Entertainment' || cat === 'Shopping') {
        leakageMinutes += visits * ESTIMATED_MINUTES_PER_VISIT;
      }
    });

    const leakageHours = (leakageMinutes / 60).toFixed(1);

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

    entries.forEach(e => {
      if (e.lastVisitTime) {
        const dayIndex = new Date(e.lastVisitTime).getDay(); // 0 = Sun
        dayCounts[dayIndex] += ((e.visitCount || 1) * ESTIMATED_MINUTES_PER_VISIT) / 60; // Add hours
      }
    });

    // Reorder to start from Mon for the chart if desired, or keep Sun-Sat
    // Let's do Mon-Sun for business week feel
    const orderedDays = [];
    // Mon(1) to Sat(6)
    for (let i = 1; i <= 6; i++) {
      orderedDays.push({ name: days[i], hours: parseFloat(dayCounts[i].toFixed(1)) });
    }
    // Add Sun(0) at end
    orderedDays.push({ name: days[0], hours: parseFloat(dayCounts[0].toFixed(1)) });

    // 5. Update State
    setStats({
      totalScreenTime: `${totalHours} hrs`,
      mostVisited: topDomain,
      visits: totalVisits.toLocaleString(),
      leakage: `${leakageHours} hrs`
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
            <span>Decrypting & Analyzing Report...</span>
        </div>
        <p className="text-xs text-gray-500">Fetching report ID: {reportId}</p>
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
            <p className="text-sm text-gray-600">Check the ID and try again, or analyze your history again from the extension.</p>
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
              {usingDemoData ? "Your Digital Pulse" : "Analysis Complete"}
            </h2>
            <div className="flex items-center gap-2 text-gray-400">
                {usingDemoData ? (
                    <span>Demo analysis based on sample data</span>
                ) : (
                    <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">ID: {reportId}</span>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-gray/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-brand-orange/30 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Est. Screen Time</p>
                <h3 className="text-2xl font-bold text-white">{stats.totalScreenTime}</h3>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Based on {stats.visits} history entries
            </div>
          </div>

          <div className="bg-brand-gray/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-brand-orange/30 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg text-green-400 group-hover:text-green-300 transition-colors">
                <MousePointerClick size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Most Visited</p>
                <h3 className="text-xl font-bold text-white truncate max-w-[180px]" title={stats.mostVisited}>
                    {stats.mostVisited}
                </h3>
              </div>
            </div>
             <div className="text-xs text-gray-500 mt-2">
              Top distraction source
            </div>
          </div>

          <div className="bg-brand-gray/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-brand-orange/30 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-brand-orange/20 rounded-lg text-brand-orange group-hover:text-orange-400 transition-colors">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Time Leakage</p>
                <h3 className="text-2xl font-bold text-white">{stats.leakage}</h3>
              </div>
            </div>
             <div className="text-xs text-gray-500 mt-2">
              Spent on Social & Entertainment
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Category Distribution */}
          <div className="bg-brand-gray/20 p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-semibold mb-6 text-white">Category Distribution</h3>
            {categoryData.length > 0 ? (
              <>
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
                          <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4 max-h-24 overflow-y-auto pr-2">
                  {categoryData.slice(0, 8).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || '#8884d8' }} />
                      <span className="text-sm text-gray-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Not enough data for categories
              </div>
            )}
          </div>

          {/* Daily Activity */}
          <div className="bg-brand-gray/20 p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-semibold mb-6 text-white">Weekly Activity (Est. Hours)</h3>
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
