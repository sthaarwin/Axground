"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ModelsPage() {
    return (
        <AppLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Machine Learning Models</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">Configure and deploy predictive models.</p>
                </div>

                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>Model Dashboard</CardTitle>
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