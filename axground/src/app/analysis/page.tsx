"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CandlestickChart } from "@/components/candlestick-chart";
import { Loader2 } from "lucide-react";

export default function AnalysisPage() {
    const [chartData, setChartData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [symbol, setSymbol] = useState("NABIL");
    const [resolution, setResolution] = useState("1D");

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
                    <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                        <div>
                            <CardTitle>Technical Chart</CardTitle>
                            <CardDescription>Daily OHLC (Open, High, Low, Close) graph.</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                            <select 
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[150px] md:w-[220px]"
                                value={symbol} 
                                onChange={(e) => setSymbol(e.target.value)}
                            >
                                <option value="NABIL">NABIL - Nabil Bank Limited</option>
                                <option value="NIMB">NIMB - Nepal Investment Mega Bank</option>
                                <option value="SCB">SCB - Standard Chartered Bank</option>
                                <option value="HBL">HBL - Himalayan Bank Limited</option>
                                <option value="SBI">SBI - Nepal SBI Bank Limited</option>
                                <option value="EBL">EBL - Everest Bank Limited</option>
                                <option value="NICA">NICA - NIC Asia Bank Limited</option>
                                <option value="MBL">MBL - Machhapuchhre Bank Limited</option>
                                <option value="LSL">LSL - Laxmi Sunrise Bank</option>
                                <option value="KBL">KBL - Kumari Bank Limited</option>
                                <option value="SBL">SBL - Siddhartha Bank Limited</option>
                                <option value="SHL">SHL - Soaltee Hotel Limited</option>
                                <option value="TRH">TRH - Taragaon Regency Hotel</option>
                                <option value="OHL">OHL - Oriental Hotels</option>
                                <option value="NHPC">NHPC - National Hydro Power</option>
                                <option value="BPCL">BPCL - Butwal Power Company</option>
                                <option value="CHCL">CHCL - Chilime Hydropower</option>
                                <option value="STC">STC - Salt Trading Corporation</option>
                                <option value="BBC">BBC - Bishal Bazar Company</option>
                                <option value="NUBL">NUBL - Nirdhan Utthan Laghubitta</option>
                                <option value="CBBL">CBBL - Chhimek Laghubitta</option>
                                <option value="DDBL">DDBL - Deprosc Laghubitta</option>
                                <option value="SANIMA">SANIMA - Sanima Bank Limited</option>
                                <option value="NABBC">NABBC - Narayani Development</option>
                                <option value="NICL">NICL - Nepal Insurance Company</option>
                                <option value="RBCL">RBCL - Rastriya Beema Company</option>
                                <option value="NLICL">NLICL - National Life Insurance</option>
                                <option value="HEI">HEI - Himalayan Everest Insurance</option>
                                <option value="UAIL">UAIL - United Ajod Insurance</option>
                                <option value="SPIL">SPIL - Siddhartha Premier Insurance</option>
                                <option value="NIL">NIL - Neco Insurance</option>
                                <option value="PRIN">PRIN - Prabhu Insurance</option>
                                <option value="SALICO">SALICO - Sagarmatha Lumbini Insurance</option>
                                <option value="IGI">IGI - IGI Prudential Insurance</option>
                                <option value="NLIC">NLIC - NEPAL LIFE INSURANCE</option>
                                <option value="LICN">LICN - Life Insurance Corporation</option>
                                <option value="SICL">SICL - Shikhar Insurance</option>
                                <option value="NFS">NFS - Nepal Finance Limited</option>
                                <option value="BNL">BNL - Bottlers Nepal</option>
                                <option value="NLO">NLO - Nepal Lube Oil</option>
                                <option value="GUFL">GUFL - Gurkhas Finance</option>
                                <option value="CIT">CIT - Citizen Investment Trust</option>
                                <option value="BNT">BNT - Bottlers Nepal Terai</option>
                                <option value="UNL">UNL - Unilever Nepal</option>
                                <option value="BFC">BFC - Best Finance Company</option>
                                <option value="GFCL">GFCL - Goodwill Finance</option>
                                <option value="HDL">HDL - Himalayan Distillery</option>
                                <option value="PFL">PFL - Pokhara Finance</option>
                                <option value="NMB">NMB - NMB Bank Limited</option>
                                <option value="SIFC">SIFC - Shree Investment Finance</option>
                            </select>
                            <Tabs value={resolution} onValueChange={setResolution} className="w-full sm:w-[200px]">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="60">1H</TabsTrigger>
                                    <TabsTrigger value="1D">1D</TabsTrigger>
                                    <TabsTrigger value="1W">1W</TabsTrigger>
                                    <TabsTrigger value="1M">1M</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-[400px]">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <CandlestickChart data={chartData} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
