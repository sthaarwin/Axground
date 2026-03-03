import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Play, ListFilter, AlertTriangle } from "lucide-react";

export default function BacktestingPage() {
    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">AXGROUND Backtesting</h2>
                        <p className="text-muted-foreground">Historical performance simulation on NEPSE data (2015-Present).</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Date Range</Button>
                        <Button variant="default"><Play className="mr-2 h-4 w-4" /> Run Simulation</Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>Performance Curve</CardTitle>
                            <CardDescription>Cumulative Equity vs NEPSE Benchmark</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] w-full bg-accent/20 rounded-xl flex items-center justify-center relative border overflow-hidden">
                                {/* Mock Chart Area */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
                                <div className="text-center space-y-2">
                                    <div className="flex justify-center gap-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                        <span className="flex items-center gap-1"><div className="w-3 h-0.5 bg-primary" /> Alpha Strategy</span>
                                        <span className="flex items-center gap-1"><div className="w-3 h-0.5 bg-muted-foreground/50" /> NEPSE</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">Chart visualization would render here using Recharts/Visx.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">ROI (Backtest)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">+245.8%</div>
                                <p className="text-xs text-muted-foreground">+Rs. 1.2M Profit (Simulated)</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Risk of Ruin</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-emerald-500">0.02%</div>
                                <p className="text-xs text-muted-foreground">High confidence score</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-amber-500/10 border-amber-500/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold flex items-center text-amber-500">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Warning
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-amber-500/80">
                                    Simulation uses "Perfect Execution" model. Real-market slippage may impact returns by 2-5%.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Execution Log</CardTitle>
                                <CardDescription>Step-by-step trade execution during simulation</CardDescription>
                            </div>
                            <Button size="sm" variant="ghost"><ListFilter className="h-4 w-4 mr-2" /> Filter Logs</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 font-mono text-[13px]">
                            {[
                                { date: "2024-02-12 11:05", type: "BUY", symbol: "NTC", price: "910.00", qty: "100", status: "Executed" },
                                { date: "2024-02-15 14:20", type: "SELL", symbol: "NABIL", price: "535.00", qty: "200", status: "Executed" },
                                { date: "2024-02-18 10:15", type: "BUY", symbol: "HDL", price: "2,350.00", qty: "50", status: "Executed" },
                                { date: "2024-02-22 15:00", type: "HOLD", symbol: "SHL", price: "410.00", qty: "0", status: "Signal Only" },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center gap-4 text-muted-foreground border-b border-border/50 pb-2 last:border-0">
                                    <span className="w-32">{log.date}</span>
                                    <Badge variant={log.type === "BUY" ? "default" : log.type === "SELL" ? "destructive" : "outline"} className="w-16 justify-center">
                                        {log.type}
                                    </Badge>
                                    <span className="w-20 font-bold text-foreground">{log.symbol}</span>
                                    <span className="flex-1">@ Rs. {log.price} (Qty: {log.qty})</span>
                                    <span className="text-xs uppercase opacity-70">{log.status}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
