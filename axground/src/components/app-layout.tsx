"use client";

import { Sidebar } from "./sidebar";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row bg-background min-h-screen relative">
            {/* Mobile Header inside the layout wrapper */}
            <div className="flex items-center justify-between p-4 border-b md:hidden bg-card z-20">
                <div className="flex-1">
                    <h1 className="text-xl font-black tracking-tighter text-primary">AXGROUND</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Sidebar Wrapper */}
            <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Sidebar />
            </div>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm" 
                    onClick={() => setMobileOpen(false)} 
                    aria-hidden="true" 
                />
            )}

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
