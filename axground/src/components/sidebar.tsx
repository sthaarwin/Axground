"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ListMusic,
    Cpu,
    Briefcase,
    TrendingUp,
    BarChart3,
    PieChart,
    Settings,
    HelpCircle,
    Gem
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Watchlist", href: "/watchlist", icon: ListMusic },
    { name: "Model Training", href: "/training", icon: Cpu },
    { name: "Portfolio Management", href: "/portfolio", icon: Briefcase },
];

const analysisLinks = [
    { name: "Market Data", href: "/data", icon: TrendingUp },
    { name: "ML Models", href: "/models", icon: BarChart3 },
    { name: "Portfolio", href: "/portfolio", icon: Briefcase },
    { name: "Analysis", href: "/analysis", icon: PieChart },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col w-72 border-r bg-card h-full min-h-screen sticky top-0 overflow-y-auto">
            <div className="p-6 hidden md:block">
                <h1 className="text-2xl font-black tracking-tighter text-primary">AXGROUND</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">NEPSE Intelligence</p>
            </div>

            <div className="flex-1 px-4 space-y-8 mt-4">
                <div>
                    <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Navigation</p>
                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    )}
                                >
                                    <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div>
                    <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Analysis Tools</p>
                    <nav className="space-y-1">
                        {analysisLinks.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 group"
                            >
                                <item.icon className="mr-3 h-5 w-5 group-hover:text-foreground" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="px-3">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 relative overflow-hidden group">
                        <Gem className="absolute -right-2 -bottom-2 h-16 w-16 text-primary/10 rotate-12 group-hover:scale-110 transition-transform" />
                        <h4 className="text-sm font-bold text-foreground">PRO Feature</h4>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Get advanced ML signals and 24/7 alerts.</p>
                        <Button size="sm" className="w-full mt-4 h-8 text-[11px] font-bold rounded-lg shadow-md shadow-primary/20">
                            Upgrade Now
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t mt-auto space-y-1">
                <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-foreground transition-colors group">
                    <Settings className="mr-3 h-5 w-5 group-hover:rotate-45 transition-transform" />
                    Settings
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-foreground transition-colors group">
                    <HelpCircle className="mr-3 h-5 w-5" />
                    Help & Docs
                </button>
            </div>
        </div>
    );
}
