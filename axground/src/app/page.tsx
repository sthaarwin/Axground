"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Activity,
  Search,
  Bell,
  Briefcase,
  Newspaper,
  ChevronRight,
  ShieldCheck,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketData {
  summary: Array<{ detail: string, value: number }>;
  top_gainers: Array<{ symbol: string, securityName: string, ltp: number, percentageChange: number }>;
  nepse_index?: [number, number];
  news?: {
    exchangeMessages?: Array<{ messageTitle: string, addedDate: string }>;
    companyNews?: Array<{ newsHeadline: string, addedDate: string }>;
  };
  last_updated?: string;
}

export default function Dashboard() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/market-data.json");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch market data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  // Consolidate news
  const newsList = [
    ...(data?.news?.companyNews?.map(n => ({ title: n.newsHeadline, date: n.addedDate })) || []),
    ...(data?.news?.exchangeMessages?.map(n => ({ title: n.messageTitle, date: n.addedDate })) || [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayNews = newsList.length > 0 ? newsList : [
    { title: "Market experiencing high volatility across sectors.", date: "Recently" },
    { title: "Policy updates from SEBON expected next week.", date: "1h ago" },
  ];

  // Helper to find summary value
  const getSummaryValue = (detail: string) => {
    return data?.summary.find(s => s.detail.includes(detail))?.value || 0;
  };

  const nepseIndexValue = data?.nepse_index?.[1] || 2045.63;
  const lastUpdatedTime = data?.last_updated || "Live";

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-foreground">AXGROUND Dashboard</h2>
            <p className="text-muted-foreground text-sm flex items-center mt-1 font-medium">
              <Activity className="h-4 w-4 mr-2 text-primary" />
              Live Market Tracking: NEPSE Index - {nepseIndexValue.toLocaleString()}
              {loading && <span className="ml-2 animate-pulse text-[10px] uppercase font-bold text-primary">Updating...</span>}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                placeholder="Search stocks..."
                className="pl-10 pr-4 py-2 bg-accent/50 border border-transparent focus:border-primary/30 focus:bg-accent hover:bg-accent rounded-xl text-sm transition-all outline-none w-64 h-11"
              />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl">
              <Bell className="h-4 w-4" />
            </Button>
            <Button className="h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20">
              <Briefcase className="h-4 w-4 mr-2" />
              Portfolio
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-8">

            {/* Price Prediction Card (Primary Highlight) */}
            <Card className="border-none shadow-2xl shadow-primary/5 bg-gradient-to-br from-card via-card to-primary/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 pt-10 opacity-5 group-hover:scale-110 group-hover:rotate-6 transition-transform decoration-transparent select-none pointer-events-none">
                <TrendingUp className="h-64 w-64 text-primary" />
              </div>
              <CardHeader className="relative z-10 pb-0 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary/20 text-primary border-none font-bold uppercase tracking-wider text-[10px] px-3">
                      AI Active
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-bold border-muted-foreground/30">
                      Axground v2.4
                    </Badge>
                  </div>
                  <CardTitle className="text-4xl font-black tracking-tighter uppercase">NTC</CardTitle>
                  <CardDescription className="text-lg font-bold text-foreground mt-1 flex items-center">
                    रू 942.00
                    <Badge variant="outline" className="ml-3 text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
                      +1.42% Today
                    </Badge>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Sentiment</div>
                  <Badge className="text-2xl h-14 w-28 bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-lg shadow-emerald-500/30">BUY</Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 pt-8 mt-4 border-t border-border/50">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center">
                      <Clock className="h-3 w-3 mr-2 text-primary" />
                      Prediction (T+24h)
                    </CardDescription>
                    <div className="text-3xl font-black text-primary tracking-tight">रू 961.40</div>
                    <p className="text-sm font-bold text-emerald-500 mt-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      +2.05% Potential Upside
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Confidence Score</CardDescription>
                    <div className="relative h-16 w-16">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * 0.88)} className="text-primary" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-lg font-black tracking-tighter">88%</div>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-wide">High Confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Gainers & Market News */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-2xl border-none shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm overflow-hidden group">
                <CardHeader className="pb-4 border-b border-border/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold flex items-center">
                      <TrendingUp className="h-5 w-5 mr-3 text-emerald-500" />
                      Top Gainers
                    </CardTitle>
                    <Button variant="link" size="sm" className="text-xs font-bold text-primary group-hover:underline">
                      View All <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {(data?.top_gainers || [
                      { symbol: "SABBL", securityName: "Salapa Bikas Bank", ltp: 707.1, percentageChange: 9.99 },
                      { symbol: "PMHPL", securityName: "Panchakanya Mai Hydro", ltp: 389.0, percentageChange: 9.89 },
                      { symbol: "RSML", securityName: "Reliance Spinning Mills", ltp: 685.5, percentageChange: 9.82 },
                    ]).slice(0, 3).map((item) => (
                      <div key={item.symbol} className="flex items-center justify-between p-5 hover:bg-accent/50 transition-colors cursor-pointer group/item">
                        <div className="flex flex-col">
                          <span className="font-black text-sm tracking-tight group-hover/item:text-primary transition-colors">{item.symbol}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase truncate max-w-[120px]">{item.securityName}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">रू {item.ltp}</div>
                          <div className={`text-xs font-black text-emerald-500`}>+{item.percentageChange}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-none shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm overflow-hidden group">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-lg font-bold flex items-center">
                    <Newspaper className="h-5 w-5 mr-3 text-primary" />
                    Market News
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {displayNews.slice(0, 2).map((item: any, i: number) => (
                      <div key={i} className="flex gap-4 group/news cursor-pointer">
                        <div className={`size-12 rounded-xl border border-border/50 bg-primary/20 flex-shrink-0 relative overflow-hidden flex items-center justify-center`}>
                           <Activity className="h-6 w-6 text-primary/40" />
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight group-hover/news:text-primary transition-colors">{item.title}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 flex items-center">
                            <Clock className="h-3 w-3 mr-1.5" />
                            {item.date.includes("T") ? new Date(item.date).toLocaleDateString() : item.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Sidebars & Widgets */}
          <div className="space-y-8">
            <Card className="rounded-2xl border-none shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm relative overflow-hidden group">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-lg font-bold flex items-center tracking-tight">
                  <Activity className="h-5 w-5 mr-3 text-primary" />
                  Market Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="p-4 rounded-xl bg-accent/50 border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Turnover</span>
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black">रू {(getSummaryValue("Turnover") / 10000000).toFixed(2)} Cr</div>
                </div>
                <div className="p-4 rounded-xl bg-accent/50 border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Traded Shares</span>
                    <Activity className="h-3 w-3 text-primary" />
                  </div>
                  <div className="text-2xl font-black">{(getSummaryValue("Traded Shares") / 100000).toFixed(2)} L</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-xl bg-primary text-primary-foreground relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 scale-150 rotate-12 opacity-10 group-hover:scale-[1.7] transition-transform">
                <ShieldCheck className="h-32 w-32" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-black tracking-tight flex items-center uppercase">
                  <ShieldCheck className="h-5 w-5 mr-3" />
                  Market Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-bold opacity-90 leading-relaxed mb-6">
                  Last Updated: {lastUpdatedTime}. System is monitoring {getSummaryValue("Scrips")} scrips in real-time.
                </p>
                <Button variant="secondary" className="w-full font-black text-xs h-12 shadow-inner bg-white/20 hover:bg-white/30 border-none rounded-xl">
                  Risk Assessment
                </Button>
              </CardContent>
            </Card>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent to-card border border-border/50 relative group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <h4 className="text-sm font-black uppercase tracking-widest flex items-center mb-2">
                Scraper Node
                <div className="h-2 w-2 rounded-full bg-emerald-500 ml-3 animate-pulse" />
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-muted-foreground uppercase">Data Feed</span>
                  <span className="text-emerald-400">Stable (0.2s)</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-muted-foreground uppercase">Last Sync</span>
                  <span className="text-emerald-400">{lastUpdatedTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
