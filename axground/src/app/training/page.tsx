"use client";

import React, { useEffect, useState, useRef } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity, Box, Cpu, History as HistoryIcon, Zap, Play, Square, Save, RotateCcw, Settings, X, Check } from "lucide-react";
import { TradeChart } from "@/components/trade-chart";

interface TrainingConfig {
    symbol: string;
    trainTestSplit: number;
    initialBalance: number;
    totalTimesteps: number;
    lookbackWindow: number;
    batchSize: number;
    nSteps: number;
    learningRate: number;
    gamma: number;
    gaeLambda: number;
    entCoef: number;
    testSymbols: string[];
    mode: string;
}

export default function TrainingLab() {
    const [trainingData, setTrainingData] = useState({
        meanReward: 0,
        actorLoss: 0,
        entropy: 0,
        vram: "CPU",
        logs: ["[SYSTEM] Waiting for model data..."],
        episodes: 0,
        symbol: "---",
        netWorth: 100000,
        balance: 100000,
        sharesHeld: 0
    });

    const [showConfig, setShowConfig] = useState(false);
    const [config, setConfig] = useState<TrainingConfig>({
        symbol: "AUTO",
        trainTestSplit: 0.8,
        initialBalance: 100000,
        totalTimesteps: 30000,
        lookbackWindow: 50,
        batchSize: 32,
        nSteps: 128,
        learningRate: 0.0003,
        gamma: 0.99,
        gaeLambda: 0.95,
        entCoef: 0.01,
        testSymbols: [],
        mode: "train"
    });
    const [configInput, setConfigInput] = useState("");
    const [saving, setSaving] = useState(false);

    const scrollViewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setConfig({
                        symbol: String(data.symbol || "AUTO"),
                        trainTestSplit: Number(data.trainTestSplit) || 0.8,
                        initialBalance: Number(data.initialBalance) || 100000,
                        totalTimesteps: Number(data.totalTimesteps) || 30000,
                        lookbackWindow: Number(data.lookbackWindow) || 50,
                        batchSize: Number(data.batchSize) || 32,
                        nSteps: Number(data.nSteps) || 128,
                        learningRate: Number(data.learningRate) || 0.0003,
                        gamma: Number(data.gamma) || 0.99,
                        gaeLambda: Number(data.gaeLambda) || 0.95,
                        entCoef: Number(data.entCoef) || 0.01,
                        testSymbols: Array.isArray(data.testSymbols) ? data.testSymbols : [],
                        mode: String(data.mode || "train")
                    });
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch('/training-logs.json')
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error("No logs yet");
                })
                .then(data => {
                    setTrainingData(data);
                })
                .catch(() => { }); // silently wait if script not running
        }, 500); // 500ms for "live" feel

        return () => clearInterval(interval);
    }, []);

    // auto-scroll on new logs
    useEffect(() => {
        if (scrollViewportRef.current) {
            const viewport = scrollViewportRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [trainingData.logs]);

    const handleSaveConfig = async () => {
        setSaving(true);
        try {
            const configToSave = {
                symbol: String(config.symbol || "AUTO"),
                trainTestSplit: Number(config.trainTestSplit) || 0.8,
                initialBalance: Number(config.initialBalance) || 100000,
                totalTimesteps: Number(config.totalTimesteps) || 30000,
                lookbackWindow: Number(config.lookbackWindow) || 50,
                batchSize: Number(config.batchSize) || 32,
                nSteps: Number(config.nSteps) || 128,
                learningRate: Number(config.learningRate) || 0.0003,
                gamma: Number(config.gamma) || 0.99,
                gaeLambda: Number(config.gaeLambda) || 0.95,
                entCoef: Number(config.entCoef) || 0.01,
                testSymbols: Array.isArray(config.testSymbols) ? config.testSymbols : [],
                mode: String(config.mode || "train")
            };
            
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(configToSave)
            });
            const data = await res.json();
            if (data.success) {
                setShowConfig(false);
            } else {
                console.error('Save config failed:', data);
            }
        } catch (e) {
            console.error('Save config error:', e);
        }
        setSaving(false);
    };

    const handleStop = async () => {
        console.log('Stopping training...');
        try {
            const res = await fetch('/api/action', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'stop' })
            });
            const data = await res.json();
            console.log('Stop response:', data);
        } catch (e) {
            console.error('Stop error:', e);
        }
        setTrainingData(prev => ({ ...prev, logs: ["[SYSTEM] Training stopped."] }));
    };

    const handleTrain = async () => {
        console.log('Starting training...');
        try {
            const res = await fetch('/api/action', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'train' })
            });
            const data = await res.json();
            console.log('Train response:', data);
        } catch (e) {
            console.error('Train error:', e);
        }
    };

    const handleBacktest = async () => {
        console.log('Starting backtest...');
        try {
            const res = await fetch('/api/action', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'backtest' })
            });
            const data = await res.json();
            console.log('Backtest response:', data);
        } catch (e) {
            console.error('Backtest error:', e);
        }
    };

    const handleReset = async () => {
        await handleStop();
    };

    const handleSaveModel = async () => {
        await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        console.log('Config saved');
    };

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-center bg-card/50 p-6 rounded-2xl border border-border/50">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase">RL Training Lab</h2>
                        <p className="text-muted-foreground text-sm font-bold flex items-center mt-1 uppercase tracking-widest leading-none">
                            <Cpu className="h-4 w-4 mr-2 text-primary" />
                            Compute Node: AXG-DGX-01
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="h-12 rounded-xl border-border/50 font-bold px-6 bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/50 text-indigo-400"
                            onClick={handleBacktest}
                        >
                            <HistoryIcon className="mr-2 h-4 w-4" /> Run Backtest (Test Set)
                        </Button>
                        <Button
                            className="h-12 rounded-xl font-black bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 px-6"
                            onClick={handleTrain}
                        >
                            <Play className="mr-2 h-4 w-4 fill-current" /> Start Training
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-xl border border-border/50"
                            onClick={() => setShowConfig(!showConfig)}
                            title="Settings"
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {showConfig && (
                    <Card className="border-none shadow-xl bg-card/95 backdrop-blur-md">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-black uppercase">Training Configuration</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setShowConfig(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardDescription>Configure training parameters and test set options</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Symbol</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-sm"
                                        value={config.symbol}
                                        onChange={(e) => setConfig({ ...config, symbol: e.target.value })}
                                        placeholder="AUTO or symbol name"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Train Split %</label>
                                    <input
                                        type="number"
                                        step="0.05"
                                        min="0.5"
                                        max="0.95"
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-sm"
                                        value={config.trainTestSplit}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setConfig({ ...config, trainTestSplit: isNaN(val) ? 0.8 : val });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Initial Balance</label>
                                    <input
                                        type="number"
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-sm"
                                        value={config.initialBalance}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setConfig({ ...config, initialBalance: isNaN(val) ? 100000 : val });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Total Timesteps</label>
                                    <input
                                        type="number"
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-sm"
                                        value={config.totalTimesteps}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setConfig({ ...config, totalTimesteps: isNaN(val) ? 30000 : val });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Lookback Window</label>
                                    <input
                                        type="number"
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-sm"
                                        value={config.lookbackWindow}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setConfig({ ...config, lookbackWindow: isNaN(val) ? 50 : val });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Batch Size</label>
                                    <input
                                        type="number"
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-sm"
                                        value={config.batchSize}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setConfig({ ...config, batchSize: isNaN(val) ? 32 : val });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground">N Steps</label>
                                    <input
                                        type="number"
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-sm"
                                        value={config.nSteps}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setConfig({ ...config, nSteps: isNaN(val) ? 128 : val });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Learning Rate</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-sm"
                                        value={config.learningRate}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setConfig({ ...config, learningRate: isNaN(val) ? 0.0003 : val });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Gamma</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.9"
                                        max="1"
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-sm"
                                        value={config.gamma}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setConfig({ ...config, gamma: isNaN(val) ? 0.99 : val });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground">GAE Lambda</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.9"
                                        max="1"
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-sm"
                                        value={config.gaeLambda}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setConfig({ ...config, gaeLambda: isNaN(val) ? 0.95 : val });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Entropy Coef</label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-sm"
                                        value={config.entCoef}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setConfig({ ...config, entCoef: isNaN(val) ? 0.01 : val });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Test Symbols (Holdout)</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-sm"
                                        value={config.testSymbols.join(', ')}
                                        onChange={(e) => setConfig({ ...config, testSymbols: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                                        placeholder="NTC, NABIL, etc (comma separated)"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4 gap-2">
                                <Button variant="outline" onClick={() => setShowConfig(false)}>Cancel</Button>
                                <Button onClick={handleSaveConfig} disabled={saving}>
                                    <Check className="mr-2 h-4 w-4" /> Save Config
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none shadow-xl bg-card relative overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mean Reward</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-black tracking-tighter ${trainingData.meanReward >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {trainingData.meanReward > 0 ? "+" : ""}{trainingData.meanReward.toFixed(2)}
                            </div>
                            <p className="text-[10px] font-black text-emerald-500/80 bg-emerald-500/5 px-2 py-1 rounded w-fit mt-3 uppercase">
                                Realtime Average
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-xl bg-card relative overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actor Loss</CardTitle>
                            <Activity className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter">{trainingData.actorLoss.toFixed(4)}</div>
                            <p className="text-[10px] font-black text-primary/80 bg-primary/5 px-2 py-1 rounded w-fit mt-3 uppercase">
                                Stabilizing
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-xl bg-card relative overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entropy</CardTitle>
                            <Box className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter">{trainingData.entropy.toFixed(3)}</div>
                            <p className="text-[10px] font-black text-amber-500/80 bg-amber-500/5 px-2 py-1 rounded w-fit mt-3 uppercase">
                                Exploring
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-xl bg-card relative overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">VRAM / Compute</CardTitle>
                            <Cpu className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter">{trainingData.vram}</div>
                            <p className="text-[10px] font-black text-muted-foreground bg-accent/50 px-2 py-1 rounded w-fit mt-3 uppercase">
                                Allocated Frame
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="col-span-1 rounded-2xl border-none shadow-2xl bg-black/40 backdrop-blur-xl overflow-hidden group">
                        <CardHeader className="border-b border-border/10 pb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-xl font-black text-primary tracking-tight">PPO_Agent_v{trainingData.episodes}</CardTitle>
                                        <Badge variant="outline" className="text-emerald-500 border-emerald-500/50 bg-emerald-500/10 font-black text-[9px] uppercase tracking-widest px-3 h-6">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                            Learning
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center">
                                        Target: {trainingData.symbol} • Episode {trainingData.episodes}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                                        onClick={handleReset}
                                        title="Reset Training"
                                    >
                                        <Square className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-lg transition-colors" onClick={handleReset} title="Reset">
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-lg transition-colors" onClick={handleSaveModel} title="Save Config">
                                        <Save className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[200px] w-full p-4 font-mono text-xs leading-relaxed selection:bg-primary selection:text-white">
                            <ScrollArea ref={scrollViewportRef} className="h-full pr-4 text-emerald-500/90 whitespace-pre">
                                <div className="space-y-1">
                                    {trainingData.logs.map((log, index) => (
                                        <p
                                            key={index}
                                            className={`
                                                    ${log.includes('[SYSTEM]') ? 'text-muted-foreground' : ''}
                                                    ${log.includes('[STEP]') ? 'text-emerald-400' : ''}
                                                    ${log.includes('-') && log.includes('[STEP]') ? 'text-red-400' : ''}
                                                `}
                                        >
                                            {log}
                                        </p>
                                    ))}
                                    <p className="animate-pulse text-primary font-black scale-150 inline-block mt-4 origin-left">█</p>
                                </div>
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>

                <div className="col-span-1 space-y-8">
                    <Card className="rounded-2xl border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
                        <CardHeader className="pb-4 border-b border-border/50">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Portfolio Snapshot</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                <div className="flex justify-between items-center p-5 hover:bg-accent/50 transition-colors group">
                                    <div>
                                        <p className="text-sm font-black tracking-tight transition-colors">Total Net Worth</p>
                                    </div>
                                    <div className="font-bold font-mono">RS {trainingData.netWorth.toFixed(2)}</div>
                                </div>
                                <div className="flex justify-between items-center p-5 hover:bg-accent/50 transition-colors group">
                                    <div>
                                        <p className="text-sm font-black tracking-tight transition-colors">Cash Balance</p>
                                    </div>
                                    <div className="font-bold font-mono">RS {trainingData.balance.toFixed(2)}</div>
                                </div>
                                <div className="flex justify-between items-center p-5 hover:bg-accent/50 transition-colors group">
                                    <div>
                                        <p className="text-sm font-black tracking-tight transition-colors">Current Holdings</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">{trainingData.symbol} Shares</p>
                                    </div>
                                    <div className="font-bold font-mono">{trainingData.sharesHeld} Unit(s)</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-none shadow-xl bg-gradient-to-br from-primary via-primary to-primary-foreground/20 text-primary-foreground overflow-hidden group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black flex items-center uppercase tracking-widest">
                                <Zap className="h-4 w-4 mr-2 fill-current" />
                                Constraints Enforced
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <p className="text-lg font-black tracking-tight mb-2 uppercase leading-none">Market Rules Active</p>
                            <p className="text-sm font-bold opacity-90 leading-relaxed space-y-1">
                                <span className="block">• Deducting 0.4% Broker & 0.015% SEBON fees</span>
                                <span className="block">• Processing 7.5% CGT on profits</span>
                                <span className="block">• Max trading vol capped per ticks limit</span>
                            </p>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
        </AppLayout >
    );
}
