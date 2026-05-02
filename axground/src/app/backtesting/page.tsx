"use client";

import React, { useEffect, useState, useRef } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, AlertTriangle } from "lucide-react";

interface Trade {
    step: number;
    action: string;
    price: number;
    netWorth: number;
    balance: number;
    shares: number;
    reward: number;
}

export default function BacktestingPage() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [initialBalance, setInitialBalance] = useState(100000);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lastCountRef = useRef(0);
    const pollRef = useRef<NodeJS.Timeout | null>(null);
    const [summary, setSummary] = useState({
        totalTrades: 0,
        buyTrades: 0,
        sellTrades: 0,
        finalNetWorth: 100000,
        initialBalance: 100000,
        totalReward: 0
    });

    const fetchTrades = () => {
        setLoading(true);
        
        Promise.all([
            fetch('/api/trades').then(res => res.json()),
            fetch('/api/config').then(res => res.json())
        ])
            .then(([tradesData, configData]) => {
                const t = tradesData.trades || [];
                setTrades(t);
                
                const initBal = Number(configData.initialBalance) || 100000;
                setInitialBalance(initBal);
                
                const buys = t.filter((tr: Trade) => tr.action === 'BUY').length;
                const sells = t.filter((tr: Trade) => tr.action === 'SELL').length;
                const finalWorth = t.length > 0 ? t[t.length - 1].netWorth : initBal;
                const totalR = t.reduce((sum: number, tr: Trade) => sum + (tr.reward || 0), 0);
                
                setSummary({
                    totalTrades: t.length,
                    buyTrades: buys,
                    sellTrades: sells,
                    finalNetWorth: finalWorth,
                    initialBalance: initBal,
                    totalReward: totalR
                });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

useEffect(() => {
        fetchTrades();
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    // Draw chart
    useEffect(() => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        if (trades.length < 2) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }
        
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Use initial balance as baseline, not min
        const baseline = summary.initialBalance;
        const maxWorth = Math.max(...trades.map(t => t.netWorth), baseline);
        const minWorth = Math.min(...trades.map(t => t.netWorth), baseline * 0.5);
        const range = maxWorth - minWorth || 1;
        
        // Grid
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 4; i++) {
            const y = (i / 4) * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Zero line
        const zeroY = height - ((baseline - minWorth) / range) * height;
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, zeroY);
        ctx.lineTo(width, zeroY);
        ctx.stroke();
        
        // Line
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        trades.forEach((t, i) => {
            const x = (i / (trades.length - 1)) * width;
            const y = height - ((t.netWorth - minWorth) / range) * (height - 20) - 10;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        // Points
        trades.forEach((t, i) => {
            if (t.action === 'BUY' || t.action === 'SELL') {
                const x = (i / (trades.length - 1)) * width;
                const y = height - ((t.netWorth - minWorth) / range) * (height - 20) - 10;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = t.action === 'BUY' ? '#10b981' : '#ef4444';
                ctx.fill();
            }
        });
    }, [trades]);

    const handleRunBacktest = async () => {
        setRunning(true);
        
        setTrades([]);
        setSummary({
            totalTrades: 0,
            buyTrades: 0,
            sellTrades: 0,
            finalNetWorth: initialBalance,
            initialBalance: initialBalance,
            totalReward: 0
        });
        
        lastCountRef.current = 0;
        
        try {
            // Start backtest in background
            fetch('/api/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'backtest' })
            });
            
            // Small delay to let backtest start
            await new Promise(r => setTimeout(r, 1500));
            
            let pollCount = 0;
            pollRef.current = setInterval(async () => {
                pollCount++;
                
                const res = await fetch('/api/trades');
                const data = await res.json();
                const t: Trade[] = data.trades || [];
                
                if (t.length > 0 && t.length > lastCountRef.current) {
                    setTrades([...t]);
                    
                    const buys = t.filter((tr) => tr.action === 'BUY').length;
                    const sells = t.filter((tr) => tr.action === 'SELL').length;
                    const finalWorth = t[t.length - 1].netWorth;
                    const totalR = t.reduce((sum, tr) => sum + (tr.reward || 0), 0);
                    
                    setSummary({
                        totalTrades: t.length,
                        buyTrades: buys,
                        sellTrades: sells,
                        finalNetWorth: finalWorth,
                        initialBalance: initialBalance,
                        totalReward: totalR
                    });
                    
                    lastCountRef.current = t.length;
                }
                
                // Check for completion
                if (pollCount > 3 && t.length > 0 && t.length === lastCountRef.current) {
                    if (pollRef.current) clearInterval(pollRef.current);
                    setRunning(false);
                }
                
                if (pollCount > 15) {
                    if (pollRef.current) clearInterval(pollRef.current);
                    setRunning(false);
                }
            }, 500);
        } catch (e) {
            console.error('Backtest error:', e);
            setRunning(false);
        }
    };

    const roi = summary.initialBalance > 0 
        ? ((summary.finalNetWorth - summary.initialBalance) / summary.initialBalance) * 100 
        : 0;
    const profit = summary.finalNetWorth - summary.initialBalance;

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Backtesting</h2>
                        <p className="text-muted-foreground">Test trained models on unseen data.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={fetchTrades} disabled={loading}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                        </Button>
                        <Button variant="default" onClick={handleRunBacktest} disabled={running}>
                            <Play className="mr-2 h-4 w-4" />
                            {running ? 'Running...' : 'Run Simulation'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">ROI</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${roi >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Profit</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {profit >= 0 ? '+' : ''}Rs {profit.toFixed(0)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.totalTrades}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rs {summary.finalNetWorth.toFixed(0)}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Net Worth Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-48 flex items-center justify-center">
                                <span className="text-muted-foreground">Loading...</span>
                            </div>
                        ) : trades.length === 0 ? (
                            <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg">
                                <span className="text-muted-foreground">No trades yet. Run a simulation.</span>
                            </div>
                        ) : (
                            <canvas ref={canvasRef} className="w-full h-48" />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Execution Log</CardTitle>
                        <CardDescription>Trade-by-trade results</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {trades.length === 0 ? (
                            <div className="h-24 flex items-center justify-center border-2 border-dashed rounded-lg">
                                <span className="text-muted-foreground">No trades to display</span>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {trades.map((trade, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm border-b border-border/30 pb-2">
                                        <span className="w-12 text-muted-foreground">#{trade.step}</span>
                                        <Badge 
                                            variant={trade.action === "BUY" ? "default" : trade.action === "SELL" ? "destructive" : "outline"}
                                            className="w-14 text-center"
                                        >
                                            {trade.action}
                                        </Badge>
                                        <span className="w-24 font-mono">Rs {trade.price.toFixed(0)}</span>
                                        <span className="flex-1 font-mono">
                                            Net: Rs {trade.netWorth.toFixed(0)} | {trade.shares} shares
                                        </span>
                                        <span className={`w-20 text-right ${trade.reward >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {trade.reward >= 0 ? '+' : ''}{trade.reward.toFixed(0)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-amber-500/10 border-amber-500/20">
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-amber-500">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">Results based on historical data. Actual returns may vary.</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}