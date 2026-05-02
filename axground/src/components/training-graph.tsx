"use client";

import React, { useEffect, useState, useRef } from "react";

interface TrainingMetrics {
    meanReward: number;
    actorLoss: number;
    entropy: number;
    episodes: number;
}

export function TrainingGraph() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [metrics, setMetrics] = useState<TrainingMetrics[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch('/training-logs.json')
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data && data.episodes > 0) {
                        setMetrics(prev => {
                            const newMetrics = [...prev, {
                                meanReward: Number(data.meanReward) || 0,
                                actorLoss: Number(data.actorLoss) || 0,
                                entropy: Number(data.entropy) || 0,
                                episodes: Number(data.episodes) || 0
                            }];
                            if (newMetrics.length > 100) newMetrics.shift();
                            return newMetrics;
                        });
                    }
                })
                .catch(() => {});
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const padding = 30;

        ctx.clearRect(0, 0, width, height);

        if (metrics.length < 2) {
            ctx.fillStyle = '#666';
            ctx.font = '14px mono';
            ctx.textAlign = 'center';
            ctx.fillText('Training in progress...', width / 2, height / 2);
            return;
        }

        const rewards = metrics.map(m => m.meanReward);
        const maxR = Math.max(...rewards, 1);
        const minR = Math.min(...rewards, -1);
        const rangeR = maxR - minR || 1;

        const xStep = (width - padding * 2) / (metrics.length - 1);
        const yScale = (height - padding * 2) / rangeR;

        // Draw mean reward line
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        metrics.forEach((m, i) => {
            const x = padding + i * xStep;
            const y = height - padding - ((m.meanReward - minR) * yScale);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw loss line
        const losses = metrics.map(m => m.actorLoss);
        const maxL = Math.max(...losses, 0.1);
        const minL = 0;
        const rangeL = maxL - minL || 1;
        const yScaleL = (height - padding * 2) / rangeL;

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        metrics.forEach((m, i) => {
            const x = padding + i * xStep;
            const y = height - padding - ((m.actorLoss - minL) * yScaleL);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Axes
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px mono';
        ctx.fillText('Episode', width / 2, height - 5);
        ctx.save();
        ctx.translate(10, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Value', 0, 0);
        ctx.restore();

        // Legend
        ctx.fillStyle = '#10b981';
        ctx.fillRect(width - 80, 10, 20, 3);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Mean Reward', width - 55, 14);

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(width - 80, 25, 20, 3);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Actor Loss', width - 55, 29);
    }, [metrics]);

    return (
        <div className="bg-card rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Training Progress</h3>
                <span className="text-xs text-muted-foreground">
                    Ep: {metrics.length > 0 ? metrics[metrics.length - 1].episodes : 0}
                </span>
            </div>
            <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full h-36 bg-background rounded-lg"
            />
        </div>
    );
}