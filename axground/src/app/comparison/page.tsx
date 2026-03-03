import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Info, Filter, Download } from "lucide-react";

export default function ComparisonPage() {
    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Model Strategy Comparison</h2>
                        <p className="text-muted-foreground">Comparative analysis of RL architectures on NEPSE datasets.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
                    </div>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Strategy Matrix</CardTitle>
                            <CardDescription>Performance metrics across different RL algorithms and market conditions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Strategy / Model</TableHead>
                                        <TableHead>Algorithm</TableHead>
                                        <TableHead>Win Rate</TableHead>
                                        <TableHead>Sharpe Ratio</TableHead>
                                        <TableHead>Max Drawdown</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        { name: "Alpha Trend", algo: "PPO v2", win: "68.4%", sharpe: "2.1", drawdown: "-8.2%", status: "Live" },
                                        { name: "Mean Reversion", algo: "DQN-Per", win: "54.1%", sharpe: "1.8", drawdown: "-12.5%", status: "Testing" },
                                        { name: "Momentum RL", algo: "A2C + LSTM", win: "72.9%", sharpe: "2.4", drawdown: "-15.1%", status: "Live" },
                                        { name: "Hybrid Scalper", algo: "SAC", win: "61.2%", sharpe: "1.9", drawdown: "-5.3%", status: "Draft" },
                                        { name: "Market Neutral", algo: "DDPG", win: "49.8%", sharpe: "1.5", drawdown: "-4.1%", status: "Testing" },
                                    ].map((row) => (
                                        <TableRow key={row.name}>
                                            <TableCell className="font-medium">{row.name}</TableCell>
                                            <TableCell>{row.algo}</TableCell>
                                            <TableCell>{row.win}</TableCell>
                                            <TableCell>{row.sharpe}</TableCell>
                                            <TableCell className="text-red-500 font-mono">{row.drawdown}</TableCell>
                                            <TableCell>
                                                <Badge variant={row.status === "Live" ? "default" : "secondary"}>
                                                    {row.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Feature Importance</CardTitle>
                                <CardDescription>Weights assigned to market indicators by RL agents.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { feature: "RSI (Relative Strength)", weight: 85 },
                                    { feature: "EMA Cross (20/50)", weight: 72 },
                                    { feature: "Volume Spikes", weight: 64 },
                                    { feature: "Bollinger Bands", weight: 48 },
                                    { feature: "Fibonacci Levels", weight: 32 },
                                ].map((item) => (
                                    <div key={item.feature} className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span>{item.feature}</span>
                                            <span className="font-mono">{item.weight}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${item.weight}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Validation Checks</CardTitle>
                                <CardDescription>Model compliance and safety parameters.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Overfitting Check</p>
                                        <p className="text-xs text-muted-foreground">Variance between Train/Validation set within bounds.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Data Leakage Scan</p>
                                        <p className="text-xs text-muted-foreground">No future data leakage detected in feature engineering.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                                    <XCircle className="h-5 w-5 text-red-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Liquidity Constraint</p>
                                        <p className="text-xs text-muted-foreground text-red-400">Model fails to account for slippage in low-volume stocks.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                                    <Info className="h-5 w-5 text-amber-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Entropy Regularization</p>
                                        <p className="text-xs text-muted-foreground">Suggestion: Increase entropy to avoid premature convergence.</p>
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
