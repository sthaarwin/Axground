"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Eye, Filter, Download, Activity, Ghost } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface MarketAsset {
    symbol: string;
    securityName?: string;
    companyName?: string;
    sectorName?: string;
    ltp: number;
    percentageChange: number;
    turnover?: number;
    totalTradedQuantity?: number;
}

interface MarketData {
    top_gainers: MarketAsset[];
    top_losers?: MarketAsset[];
    top_turnover?: MarketAsset[];
    securities?: MarketAsset[];
    is_market_open?: boolean;
}

export default function WatchlistPage() {
    const [data, setData] = useState<MarketData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("gainers");
    const [sectorFilter, setSectorFilter] = useState("All Sectors");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/market-data.json");
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (err) {
                console.error("Failed to fetch watchlist:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const allSectors = Array.from(new Set(data?.securities?.map(s => s.sectorName).filter(Boolean))) as string[];

    const getAssets = () => {
        let base = [];
        switch(activeTab) {
            case "losers": base = data?.top_losers || []; break;
            case "turnover": base = data?.top_turnover || []; break;
            default: base = data?.top_gainers || []; break;
        }
        
        if (sectorFilter !== "All Sectors") {
          return base.filter(a => a.sectorName === sectorFilter);
        }
        return base;
    }

    const assets = getAssets();

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight uppercase">Market Stream</h2>
                        <p className="text-sm text-muted-foreground font-medium flex items-center mt-1">
                            <Activity className={cn("h-4 w-4 mr-2", data?.is_market_open ? "text-emerald-500 animate-pulse" : "text-red-500")} />
                            {data?.is_market_open ? "Market is Open" : "Market is Closed"} • {assets.length} items tracked
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                          <select 
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                            className="h-11 rounded-xl border border-border/40 bg-card px-4 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 appearance-none pr-10 min-w-[180px]"
                          >
                            <option>All Sectors</option>
                            {allSectors.sort().map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        </div>
                        <Button className="h-11 rounded-xl font-bold px-6 shadow-lg shadow-primary/20"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
                    <TabsList className="bg-card/50 border border-border/50 p-1 h-12 rounded-xl">
                      <TabsTrigger value="gainers" className="rounded-lg font-black text-[10px] uppercase px-6 h-10 data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all">Top Gainers</TabsTrigger>
                      <TabsTrigger value="losers" className="rounded-lg font-black text-[10px] uppercase px-6 h-10 data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all">Top Losers</TabsTrigger>
                      <TabsTrigger value="turnover" className="rounded-lg font-black text-[10px] uppercase px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Volume Leaders</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <Card className="rounded-2xl border-none shadow-2xl shadow-black/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md overflow-hidden ring-1 ring-white/5">
                      <CardContent className="p-0">
                          <Table>
                              <TableHeader className="bg-muted-foreground/5 font-black border-b border-border/50">
                                  <TableRow className="hover:bg-transparent border-none">
                                      <TableHead className="w-[140px] font-bold text-[11px] uppercase tracking-widest px-8">Asset</TableHead>
                                      <TableHead className="font-bold text-[11px] uppercase tracking-widest">Sector & Info</TableHead>
                                      <TableHead className="text-right font-bold text-[11px] uppercase tracking-widest">LTP (रू)</TableHead>
                                      <TableHead className="text-right font-bold text-[11px] uppercase tracking-widest">Change</TableHead>
                                      <TableHead className="text-right font-bold text-[11px] uppercase tracking-widest px-8">Activity</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {loading ? (
                                     <TableRow>
                                       <TableCell colSpan={5} className="h-64 text-center">
                                         <div className="flex flex-col items-center justify-center gap-3 opacity-40">
                                            <Activity className="h-8 w-8 animate-spin text-primary" />
                                            <p className="font-black text-[10px] uppercase tracking-[0.2em]">Syncing NEPSE Stream...</p>
                                         </div>
                                       </TableCell>
                                     </TableRow>
                                  ) : assets.length === 0 ? (
                                    <TableRow>
                                      <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3 opacity-20">
                                           <Ghost className="h-12 w-12" />
                                           <p className="font-black text-[10px] uppercase tracking-[0.2em]">No results for {sectorFilter}</p>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ) : assets.map((asset, i) => (
                                      <TableRow key={i} className="border-border/40 hover:bg-white/5 cursor-pointer transition-all duration-300 group">
                                          <TableCell className="px-8 py-4">
                                              <div className="flex flex-col">
                                                <span className="font-black text-sm tracking-tight group-hover:text-primary transition-colors underline decoration-primary/20 hover:decoration-primary underline-offset-8 decoration-1">
                                                  {asset.symbol}
                                                </span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed mt-1 opacity-60">
                                                  ID: {asset.symbol}
                                                </span>
                                              </div>
                                          </TableCell>
                                          <TableCell className="max-w-[250px]">
                                              <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] font-black uppercase text-foreground/90 truncate">
                                                  {asset.securityName || asset.companyName || "Listed Equity"}
                                                </span>
                                                <Badge variant="outline" className="w-fit h-5 px-2 rounded-md text-[8px] uppercase font-black bg-primary/5 text-primary/70 border-primary/20">
                                                  {asset.sectorName || "Unclassified"}
                                                </Badge>
                                              </div>
                                          </TableCell>
                                          <TableCell className="text-right font-black text-sm tabular-nums">
                                              रू {(asset?.ltp || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                          </TableCell>
                                          <TableCell className={cn("text-right font-black text-sm tabular-nums", (asset?.percentageChange || 0) >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                                              <div className="flex items-center justify-end gap-1.5 font-black">
                                                  {(asset?.percentageChange || 0) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                  {(asset?.percentageChange || 0).toFixed(2)}%
                                              </div>
                                          </TableCell>
                                          <TableCell className="text-right px-8">
                                              <div className="flex flex-col items-end gap-0.5">
                                                <span className="text-[10px] font-black tabular-nums text-foreground/80">
                                                  {activeTab === 'turnover' ? `रू ${(asset.turnover! / 10000000).toFixed(2)} Cr` : asset.totalTradedQuantity?.toLocaleString()}
                                                </span>
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                                                  {activeTab === 'turnover' ? 'Turnover' : 'Quantity'}
                                                </span>
                                              </div>
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </CardContent>
                  </Card>
                </div>
            </div>
        </AppLayout>
    );
}
