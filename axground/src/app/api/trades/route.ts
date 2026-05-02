import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const baseDir = path.resolve(process.cwd(), '..');
        const tradePath = path.join(baseDir, 'axground', 'public', 'trade-history.json');
        
        if (!existsSync(tradePath)) {
            return NextResponse.json({ trades: [], summary: {} });
        }
        
        const trades = JSON.parse(readFileSync(tradePath, 'utf8'));
        
        const summary = {
            totalTrades: trades.length,
            buyTrades: trades.filter(t => t.action === 'BUY').length,
            sellTrades: trades.filter(t => t.action === 'SELL').length,
            finalNetWorth: trades.length > 0 ? trades[trades.length - 1].netWorth : 0,
            totalReward: trades.reduce((sum, t) => sum + (t.reward || 0), 0)
        };
        
        return NextResponse.json({ trades, summary });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}