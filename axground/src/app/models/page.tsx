"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Upload, Play, Info } from "lucide-react";

interface ModelInfo {
    name: string;
    created: string;
    episodes: number;
    symbol: string;
    finalReward: number;
    status: string;
}

export default function ModelsPage() {
    const [models, setModels] = useState<ModelInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/models')
            .then(res => res.json())
            .then(data => {
                setModels(data.models || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleDelete = async (name: string) => {
        if (!confirm(`Delete ${name}?`)) return;
        await fetch(`/api/models?delete=${name}`, { method: 'DELETE' });
        setModels(models.filter(m => m.name !== name));
    };

    const handleDeploy = (name: string) => {
        setSelectedModel(name);
        alert(`Model ${name} selected for backtesting. Go to Training page to run.`);
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">ML Models</h2>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your trained RL agents.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" /> Import
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" /> Export
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <Card className="col-span-full">
                            <CardContent className="p-8 text-center">
                                <span className="text-muted-foreground">Loading models...</span>
                            </CardContent>
                        </Card>
                    ) : models.length === 0 ? (
                        <Card className="col-span-full">
                            <CardHeader>
                                <CardTitle>No Models Yet</CardTitle>
                                <CardDescription>Train a model in the Training page to see it here.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[100px] flex items-center justify-center border-2 border-dashed rounded-lg">
                                    <span className="text-muted-foreground">Train first model at /training</span>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        models.map((model) => (
                            <Card key={model.name} className={`border-none shadow-xl ${selectedModel === model.name ? 'ring-2 ring-primary' : ''}`}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-black">{model.name}</CardTitle>
                                        <Badge variant={model.status === 'active' ? 'default' : 'outline'}>
                                            {model.status}
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-xs">
                                        Trained on {model.symbol} • {model.episodes} episodes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Final Reward</span>
                                            <span className={`font-mono ${model.finalReward >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {model.finalReward >= 0 ? '+' : ''}{model.finalReward.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Created</span>
                                            <span className="font-mono">{model.created}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="flex-1"
                                            onClick={() => handleDeploy(model.name)}
                                        >
                                            <Play className="h-3 w-3 mr-1" /> Use
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleDelete(model.name)}
                                        >
                                            <Trash2 className="h-3 w-3 text-red-500" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <Card className="border-none shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Model Information
                        </CardTitle>
                        <CardDescription>PPO (Proximal Policy Optimization) agents for NEPSE trading</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3 text-sm">
                            <div>
                                <span className="text-muted-foreground block text-xs uppercase">Policy</span>
                                <span className="font-mono">MlpPolicy</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-xs uppercase">Network</span>
                                <span className="font-mono">128 x 128 MLP</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-xs uppercase">Actions</span>
                                <span className="font-mono">HOLD / BUY / SELL</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}