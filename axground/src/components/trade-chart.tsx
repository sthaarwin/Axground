"use client";

import React, { useEffect, useState, useRef } from "react";

interface Trade {
    step: number;
    action: string;
    price: number;
    netWorth: number;
    balance: number;
    shares: number;
    reward: number;
    message: string;
}

interface TradeChartProps {
    symbol?: string;
}

export function TradeChart({ symbol = "NIMB" }: TradeChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [summary, setSummary] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/trades')
            .then(res => res.json())
            .then(data => {
                setTrades(data.trades || []);
                setSummary(data.summary || {});
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || trades.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;

        ctx.clearRect(0, 0, width, height);

        if (trades.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '14px mono';
            ctx.textAlign = 'center';
            ctx.fillText('No trades yet. Run backtest first.', width / 2, height / 2);
            return;
        }

        const netWorths = trades.map(t => t.netWorth);
        const minWorth = Math.min(...netWorths) * 0.95;
        const maxWorth = Math.max(...netWorths) * 1.05;
        const worthRange = maxWorth - minWorth || 1;

        const xStep = (width - padding * 2) / (trades.length - 1 || 1);
        const yScale = (height - padding * 2) / worthRange;

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        trades.forEach((trade, i) => {
            const x = padding + i * xStep;
            const y = height - padding - (trade.netWorth - minWorth) * yScale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        trades.forEach((trade, i) => {
            const x = padding + i * xStep;
            const y = height - padding - (trade.netWorth - minWorth) * yScale;
            
            if (trade.action === 'BUY') {
                ctx.fillStyle = '#10b981';
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fill();
            } else if (trade.action === 'SELL') {
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, height / 2);
        ctx.lineTo(width - padding, height / 2);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px mono';
        ctx.textAlign = 'left';
        ctx.fillText(`Rs ${maxWorth.toFixed(0)}`, width - padding + 5, padding);
        ctx.fillText(`Rs ${minWorth.toFixed(0)}`, width - padding + 5, height - padding);
    }, [trades]);

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center bg-card rounded-xl">
                <span className="text-muted-foreground">Loading trades...</span>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Trade Performance</h3>
                <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" /> BUY
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" /> SELL
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-slate-700" /> HOLD
                    </span>
                </div>
            </div>
            
            <canvas
                ref={canvasRef}
                width={500}
                height={200}
                className="w-full h-48 bg-background rounded-lg"
            />
            
            {summary.totalTrades > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
                    <div className="bg-muted p-2 rounded">
                        <div className="text-muted-foreground">Total Trades</div>
                        <div className="font-bold">{summary.totalTrades}</div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                        <div className="text-muted-foreground">Buy</div>
                        <div className="font-bold text-emerald-500">{summary.buyTrades}</div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                        <div className="text-muted-foreground">Sell</div>
                        <div className="font-bold text-red-500">{summary.sellTrades}</div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                        <div className="text-muted-foreground">Final Worth</div>
                        <div className="font-bold">Rs {summary.finalNetWorth?.toFixed(0)}</div>
                    </div>
                </div>
            )}
        </div>
    );
}