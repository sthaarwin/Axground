"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CandlestickChart } from "@/components/candlestick-chart";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AnalysisPage() {
    const [chartData, setChartData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [symbol, setSymbol] = useState("NABIL");
    const [resolution, setResolution] = useState("1D");
    const [showSma, setShowSma] = useState(false);
    const [showSmc, setShowSmc] = useState(false);
    const [smcOptions, setSmcOptions] = useState({ fvg: true, bos: true, orderBlock: true, liquidity: true });

    const toggleSmcOption = (key: keyof typeof smcOptions) => {
        setSmcOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                // Fetch data from our newly created internal API proxy
                const response = await fetch(`/api/history?symbol=${symbol}&resolution=${resolution}`);
                if (!response.ok) {
                    console.error("Failed to fetch data");
                } else {
                    const data = await response.json();
                    
                    // Filter out duplicates that might occur due to time zone differences if using raw strings from TV API
                    // The API route handles formatting it perfectly to YYYY-MM-DD
                    const uniqueData = Array.from(new Map(data.map((item: any) => [item.time, item])).values());
                    
                    // Sort chronologically ascending
                    uniqueData.sort((a: any, b: any) => {
                        const timeA = typeof a.time === 'string' ? new Date(a.time).getTime() : a.time;
                        const timeB = typeof b.time === 'string' ? new Date(b.time).getTime() : b.time;
                        return timeA - timeB;
                    });
                    
                    setChartData(uniqueData);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [symbol, resolution]);

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Market Analysis (Charts)</h2>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">Interactive candlestick charts and technical indicators.</p>
                    </div>
                </div>

                <Card className="border-border">
                    <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <div>
                                <CardTitle>Technical Chart</CardTitle>
                                <CardDescription>Daily OHLC (Open, High, Low, Close) graph.</CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <select 
                                    className="h-9 rounded-md border border-input bg-background px-2 py-1 text-sm"
                                    value={symbol} 
                                    onChange={(e) => setSymbol(e.target.value)}
                                >
                                    <option value="NABIL">NABIL</option>
                                    <option value="NIMB">NIMB</option>
                                    <option value="SCB">SCB</option>
                                    <option value="HBL">HBL</option>
                                    <option value="SBI">SBI</option>
                                    <option value="EBL">EBL</option>
                                    <option value="NICA">NICA</option>
                                    <option value="MBL">MBL</option>
                                    <option value="LSL">LSL</option>
                                    <option value="KBL">KBL</option>
                                    <option value="SBL">SBL</option>
                                    <option value="SANIMA">SANIMA</option>
                                </select>
                                <div className="flex rounded-md border divide-x">
                                    <Button
                                        variant={showSma ? "secondary" : "ghost"}
                                        size="sm"
                                        className="rounded-r-none"
                                        onClick={() => setShowSma(!showSma)}
                                    >
                                        SMA
                                    </Button>
                                    <Button
                                        variant={showSmc ? "secondary" : "ghost"}
                                        size="sm"
                                        className="rounded-l-none"
                                        onClick={() => setShowSmc(!showSmc)}
                                    >
                                        SMC
                                    </Button>
                                </div>
                                {showSmc && (
                                    <div className="flex rounded-md border divide-x">
                                        <Button
                                            variant={smcOptions.fvg ? "default" : "ghost"}
                                            size="sm"
                                            className="rounded-none px-2"
                                            onClick={() => toggleSmcOption('fvg')}
                                        >
                                            FVG
                                        </Button>
                                        <Button
                                            variant={smcOptions.bos ? "default" : "ghost"}
                                            size="sm"
                                            className="rounded-none px-2"
                                            onClick={() => toggleSmcOption('bos')}
                                        >
                                            BOS
                                        </Button>
                                        <Button
                                            variant={smcOptions.orderBlock ? "default" : "ghost"}
                                            size="sm"
                                            className="rounded-none px-2"
                                            onClick={() => toggleSmcOption('orderBlock')}
                                        >
                                            OB
                                        </Button>
                                        <Button
                                            variant={smcOptions.liquidity ? "default" : "ghost"}
                                            size="sm"
                                            className="rounded-l-none"
                                            onClick={() => toggleSmcOption('liquidity')}
                                        >
                                            LS
                                        </Button>
                                    </div>
                                )}
                                <Tabs value={resolution} onValueChange={setResolution} className="h-9">
                                    <TabsList className="h-full">
                                        <TabsTrigger value="60" className="text-xs px-2">1H</TabsTrigger>
                                        <TabsTrigger value="1D" className="text-xs px-2">1D</TabsTrigger>
                                        <TabsTrigger value="1W" className="text-xs px-2">1W</TabsTrigger>
                                        <TabsTrigger value="1M" className="text-xs px-2">1M</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-[400px]">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <CandlestickChart data={chartData} showSma={showSma} showSmc={showSmc} smcOptions={smcOptions} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
