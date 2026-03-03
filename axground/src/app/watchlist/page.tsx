import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Eye, Filter, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WatchlistPage() {
    const stocks = [
        { symbol: "HDL", name: "Himalayan Distillery", ltp: "2,420.00", change: "+9.8%", volume: "42.5K", signal: "BUY" },
        { symbol: "NTC", name: "Nepal Telecom", ltp: "942.00", change: "+1.42%", volume: "125.1K", signal: "HOLD" },
        { symbol: "NABIL", name: "Nabil Bank Ltd.", ltp: "528.00", change: "-0.4%", volume: "210.3K", signal: "HOLD" },
        { symbol: "UPPER", name: "Upper Tamakoshi", ltp: "215.10", change: "+5.4%", volume: "450.2K", signal: "BUY" },
        { symbol: "MLBL", name: "Muktinath Bikas", ltp: "394.00", change: "+9.8%", volume: "18.2K", signal: "BUY" },
        { symbol: "CHL", name: "Chilime Hydro", ltp: "382.00", change: "+10.0%", volume: "85.6K", signal: "STRONG BUY" },
    ];

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight uppercase">Watchlist</h2>
                        <p className="text-sm text-muted-foreground font-medium flex items-center mt-1">
                            <Eye className="h-4 w-4 mr-2 text-primary" />
                            Tracking {stocks.length} active assets on NEPSE.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-11 rounded-xl"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                        <Button className="h-11 rounded-xl font-bold"><Download className="mr-2 h-4 w-4" /> Export (.CSV)</Button>
                    </div>
                </div>

                <Card className="rounded-2xl border-none shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-4 border-b border-border/50">
                        <CardTitle className="text-lg font-black tracking-widest uppercase flex items-center">
                            Market Stream
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted-foreground/5 font-black">
                                <TableRow className="hover:bg-transparent border-border/50">
                                    <TableHead className="w-[120px] font-bold text-[11px] uppercase tracking-widest px-6">Symbol</TableHead>
                                    <TableHead className="font-bold text-[11px] uppercase tracking-widest">Company Name</TableHead>
                                    <TableHead className="text-right font-bold text-[11px] uppercase tracking-widest">LTP (रू)</TableHead>
                                    <TableHead className="text-right font-bold text-[11px] uppercase tracking-widest">Change</TableHead>
                                    <TableHead className="text-right font-bold text-[11px] uppercase tracking-widest">Volume</TableHead>
                                    <TableHead className="text-center font-bold text-[11px] uppercase tracking-widest px-6">ML Signal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stocks.map((stock) => (
                                    <TableRow key={stock.symbol} className="border-border/50 hover:bg-accent/40 cursor-pointer transition-colors group">
                                        <TableCell className="font-black text-sm px-6 tracking-tight group-hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4 decoration-2">
                                            {stock.symbol}
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-muted-foreground uppercase">{stock.name}</TableCell>
                                        <TableCell className="text-right font-black text-sm">रू {stock.ltp}</TableCell>
                                        <TableCell className={`text-right font-black text-sm ${stock.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                            <div className="flex items-center justify-end gap-1">
                                                {stock.change.startsWith('+') ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                {stock.change}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-xs opacity-60 uppercase">{stock.volume}</TableCell>
                                        <TableCell className="text-center px-6">
                                            <Badge variant={stock.signal.includes('BUY') ? 'default' : 'secondary'} className={cn(
                                                "font-black text-[10px] uppercase h-7 w-24 justify-center shadow-lg",
                                                stock.signal === 'STRONG BUY' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' :
                                                    stock.signal === 'BUY' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'shadow-primary/10'
                                            )}>
                                                {stock.signal}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
