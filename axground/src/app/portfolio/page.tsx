"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PortfolioPage() {
    return (
        <AppLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Portfolio Management</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage and track your investments.</p>
                </div>

                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>Portfolio Overview</CardTitle>
                        <CardDescription>This feature is currently under development.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg">
                            <span className="text-muted-foreground">Coming Soon</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}