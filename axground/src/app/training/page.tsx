import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity, Box, Cpu, History as HistoryIcon, Zap, Play, Square, Save, RotateCcw } from "lucide-react";

export default function TrainingLab() {
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
                        <Button variant="outline" className="h-12 rounded-xl border-border/50 font-bold px-6">
                            <HistoryIcon className="mr-2 h-4 w-4" /> Snapshots
                        </Button>
                        <Button className="h-12 rounded-xl font-black bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 px-6">
                            <Play className="mr-2 h-4 w-4 fill-current" /> Continue Session
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none shadow-xl bg-card relative overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mean Reward</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter text-emerald-500">+124.50</div>
                            <p className="text-[10px] font-black text-emerald-500/80 bg-emerald-500/5 px-2 py-1 rounded w-fit mt-3 uppercase">
                                Trending Up 12%
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-xl bg-card relative overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actor Loss</CardTitle>
                            <Activity className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter">0.0042</div>
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
                            <div className="text-3xl font-black tracking-tighter">0.682</div>
                            <p className="text-[10px] font-black text-amber-500/80 bg-amber-500/5 px-2 py-1 rounded w-fit mt-3 uppercase">
                                Exploring
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-xl bg-card relative overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">GPU Memory</CardTitle>
                            <Cpu className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter">4.2 GB</div>
                            <p className="text-[10px] font-black text-muted-foreground bg-accent/50 px-2 py-1 rounded w-fit mt-3 uppercase">
                                VRAM Optimized
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 md:grid-cols-7">
                    <Card className="col-span-4 rounded-2xl border-none shadow-2xl bg-black/40 backdrop-blur-xl overflow-hidden group">
                        <CardHeader className="border-b border-border/10 pb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-xl font-black text-primary tracking-tight">PPO_Agent_v2_NTC</CardTitle>
                                        <Badge variant="outline" className="text-emerald-500 border-emerald-500/50 bg-emerald-500/10 font-black text-[9px] uppercase tracking-widest px-3 h-6">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                            Learning
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center">
                                        Epoch 142/500 • Episode 1,420 • Start: 17:34:32
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-lg transition-colors"><Square className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-lg transition-colors"><RotateCcw className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-lg transition-colors"><Save className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="h-[450px] w-full p-8 font-mono text-xs leading-relaxed selection:bg-primary selection:text-white">
                                <ScrollArea className="h-full pr-4 text-emerald-500/90 whitespace-pre">
                                    <div className="space-y-1">
                                        <p className="opacity-40 italic">[LOG_START_TIME 2026-03-03T17:34:32+05:45]</p>
                                        <p className="text-muted-foreground">[SYSTEM] Initializing CUDA backend via PyTorch v2.6.0</p>
                                        <p className="text-muted-foreground">[SYSTEM] Allocating 4.2GB VRAM for model parameters</p>
                                        <p className="text-muted-foreground mt-4">[INFO] Environment reset successful. New seed: 42</p>
                                        <p className="text-muted-foreground">[STEP] Episode 1419 complete. Total Reward: +89.2</p>
                                        <p className="text-primary font-bold">[INFO] Saving checkpoint to /models/ppo_agent_v2_ntc_ep1400.pt</p>
                                        <p className="text-emerald-500 font-black brightness-125">[SUCCESS] Performance increased by 4.2% in last 100 episodes</p>
                                        <p className="text-muted-foreground">[STEP] Episode 1420 starting...</p>
                                        <p className="text-muted-foreground">[DATA] Fetching updated order book for NTC...</p>
                                        <p className="text-amber-400">[WARN] High volatility detected in NEPSE-S sector (Sensitive)</p>
                                        <p className="text-muted-foreground">[POLICY] Action Probs: [0.85 HOLD, 0.12 BUY, 0.03 SELL]</p>
                                        <p className="animate-pulse text-primary font-black scale-150 inline-block mt-4 origin-left">█</p>
                                    </div>
                                </ScrollArea>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="col-span-3 space-y-8">
                        <Card className="rounded-2xl border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Live Assets</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/50">
                                    <div className="flex justify-between items-center p-5 hover:bg-accent/50 transition-colors cursor-pointer group">
                                        <div>
                                            <p className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">Nepal Telecom (NTC)</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">LTP: 942.00</p>
                                        </div>
                                        <Badge variant="outline" className="font-bold border-emerald-500/20 bg-emerald-500/5 text-emerald-500">+1.2%</Badge>
                                    </div>
                                    <div className="flex justify-between items-center p-5 hover:bg-accent/50 transition-colors cursor-pointer group">
                                        <div>
                                            <p className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">Nabil Bank (NABIL)</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">LTP: 521.00</p>
                                        </div>
                                        <Badge variant="outline" className="font-bold border-red-500/20 bg-red-500/5 text-red-500">-0.4%</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-none shadow-xl bg-gradient-to-br from-primary via-primary to-primary-foreground/20 text-primary-foreground overflow-hidden group">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black flex items-center uppercase tracking-widest">
                                    <Zap className="h-4 w-4 mr-2 fill-current" />
                                    Agent Insight
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <p className="text-lg font-black tracking-tight mb-2 uppercase leading-none">Policy Confidence</p>
                                <p className="text-sm font-bold opacity-90 leading-relaxed">
                                    Agent is currently highly confident in <span className="bg-white/20 px-2 py-0.5 rounded italic">HOLD</span> actions based on EMA trends.
                                </p>
                                <div className="mt-6 flex justify-between items-end">
                                    <div className="text-[10px] font-bold uppercase opacity-80 letter tracking-tighter">Reward Attribution</div>
                                    <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 border-none h-8 text-[10px] font-bold uppercase rounded-lg">View Heatmap</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-none shadow-xl bg-card overflow-hidden">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Snapshots</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-2 space-y-1">
                                    <div className="flex justify-between items-center text-[11px] p-3 hover:bg-accent rounded-xl transition-colors font-bold uppercase group cursor-pointer">
                                        <span className="text-muted-foreground group-hover:text-foreground">v2.4 (Latest)</span>
                                        <span className="font-black text-primary">+124.5</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] p-3 hover:bg-accent rounded-xl transition-colors font-bold uppercase group cursor-pointer">
                                        <span className="text-muted-foreground group-hover:text-foreground">v2.3 (Checkpoint)</span>
                                        <span className="font-black"> +102.1</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] p-3 hover:bg-accent rounded-xl transition-colors font-bold uppercase group cursor-pointer">
                                        <span className="text-muted-foreground group-hover:text-foreground">v2.2 (Baseline)</span>
                                        <span className="font-black text-red-400"> +76.4</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
