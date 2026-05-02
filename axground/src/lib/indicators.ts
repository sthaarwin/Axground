export function calculateSMA(data: any[], period: number) {
    const sma = [];
    for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j].close;
        }
        sma.push({ time: data[i].time, value: sum / period });
    }
    return sma;
}

export function calculateAllSMA(data: any[]) {
    if (!data || data.length < 50) return {};
    return {
        sma9: calculateSMA(data, 9),
        sma20: calculateSMA(data, 20),
        sma50: calculateSMA(data, 50),
        sma200: calculateSMA(data, 200),
    };
}

export function calculateSMCMarkers(data: any[]) {
    const markers = [];
    let lastTrend = 0; // 1 for bull, -1 for bear
    
    for (let i = 2; i < data.length - 1; i++) {
        const prev = data[i - 2];
        const curr = data[i - 1]; // Signal candle
        const next = data[i];

        // 1. Fair Value Gaps (FVG)
        const isBullishFVG = next.low > prev.high && curr.close > curr.open;
        const isBearishFVG = next.high < prev.low && curr.close < curr.open;

        if (isBullishFVG) {
            markers.push({
                time: curr.time,
                position: 'belowBar',
                color: '#3b82f6', // blue
                shape: 'arrowUp',
                text: 'Bull FVG'
            });
        }
        
        if (isBearishFVG) {
            markers.push({
                time: curr.time,
                position: 'aboveBar',
                color: '#f59e0b', // orange
                shape: 'arrowDown',
                text: 'Bear FVG'
            });
        }

        // 2. Break Of Structure / Change of Character (BOS/CHoCH) - simplified
        if (i > 10) {
           const lookback = data.slice(i-10, i-1);
           const localHigh = Math.max(...lookback.map(d => d.high));
           const localLow = Math.min(...lookback.map(d => d.low));
           
           if (curr.close > localHigh && lastTrend <= 0) {
               markers.push({
                    time: curr.time,
                    position: 'belowBar',
                    color: '#10b981', // emerald
                    shape: 'circle',
                    text: 'BOS (Bull)'
               });
               lastTrend = 1;
           } else if (curr.close < localLow && lastTrend >= 0) {
               markers.push({
                    time: curr.time,
                    position: 'aboveBar',
                    color: '#ef4444', // red
                    shape: 'circle',
                    text: 'CHoCH (Bear)'
               });
               lastTrend = -1;
           }
        }
    }
    
    // Remove duplicate markers on the same day by grouping by time
    const uniqueMarkers = Object.values(
        markers.reduce((acc, m) => {
            if (!acc[m.time]) acc[m.time] = m;
            // If conflict, prefer BOS over FVG for cleaner chart
            else if (m.text.includes('BOS') || m.text.includes('CHoCH')) acc[m.time] = m;
            return acc;
        }, {} as Record<string, any>)
    );
    
    // Lightweight charts requires markers to be accurately sorted linearly by time
    return uniqueMarkers.sort((a: any, b: any) => {
         const timeA = typeof a.time === 'string' ? new Date(a.time).getTime() : a.time;
         const timeB = typeof b.time === 'string' ? new Date(b.time).getTime() : b.time;
         return timeA - timeB;
    });
}

export function calculateOrderBlocks(data: any[]): any[] {
    const orderBlocks: any[] = [];
    let trend = 0;
    
    for (let i = 5; i < data.length; i++) {
        const prev = data[i - 5];
        
        // Look for reversal candles preceded by significant move
        const lookback = data.slice(Math.max(0, i - 10), i - 1);
        const moveUp = lookback.every(c => c.close > c.open);
        const moveDown = lookback.every(c => c.close < c.open);
        
        const curr = data[i];
        const isBullish = curr.close > curr.open;
        const isBearish = curr.close < curr.open;
        
        // Bullish OB: downtrend + strong bullish candle = institutional buy zone
        if (moveDown && isBullish && trend !== 1) {
            orderBlocks.push({
                time: curr.time,
                position: 'belowBar',
                color: '#8b5cf6',
                shape: 'square',
                text: 'Bull OB'
            });
            trend = 1;
        }
        // Bearish OB: uptrend + strong bearish candle = institutional sell zone
        else if (moveUp && isBearish && trend !== -1) {
            orderBlocks.push({
                time: curr.time,
                position: 'aboveBar',
                color: '#ec4899',
                shape: 'square',
                text: 'Bear OB'
            });
            trend = -1;
        }
    }
    
    return orderBlocks;
}

export function calculateLiquiditySweeps(data: any[]): any[] {
    const sweeps: any[] = [];
    
    for (let i = 10; i < data.length; i++) {
        const lookback = data.slice(i - 10, i);
        const highs = lookback.map(c => c.high);
        const lows = lookback.map(c => c.low);
        const swingHigh = Math.max(...highs);
        const swingLow = Math.min(...lows);
        
        const curr = data[i];
        
        // Liquidity sweep above - price hunts liquidity at highs
        if (curr.high >= swingHigh && curr.close < curr.open) {
            sweeps.push({
                time: curr.time,
                position: 'aboveBar',
                color: '#ef4444',
                shape: 'chevronUp',
                text: 'Liquidity Sweep'
            });
        }
        // Liquidity sweep below - price hunts liquidity at lows
        else if (curr.low <= swingLow && curr.close > curr.open) {
            sweeps.push({
                time: curr.time,
                position: 'belowBar',
                color: '#10b981',
                shape: 'chevronDown',
                text: 'Liquidity Sweep'
            });
        }
    }
    
    return sweeps;
}

export function calculateAllSMCMarkers(data: any[], options?: { fvg?: boolean; bos?: boolean; orderBlock?: boolean; liquidity?: boolean }): any[] {
    if (!data || data.length < 20) return [];
    
    const opts = { fvg: true, bos: true, orderBlock: true, liquidity: true, ...options };
    const markers: any[] = [];
    
    if (opts.fvg) {
        markers.push(...calculateSMCMarkers(data));
    }
    if (opts.orderBlock) {
        markers.push(...calculateOrderBlocks(data));
    }
    if (opts.liquidity) {
        markers.push(...calculateLiquiditySweeps(data));
    }
    
    return markers.sort((a: any, b: any) => {
        const timeA = typeof a.time === 'string' ? new Date(a.time).getTime() : a.time;
        const timeB = typeof b.time === 'string' ? new Date(b.time).getTime() : b.time;
        return timeA - timeB;
    });
}