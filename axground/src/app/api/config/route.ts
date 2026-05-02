import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const CONFIG_FILE = 'training-config.json';

export async function GET() {
    try {
        // Config is in scripts folder (sibling to axground)
        const baseDir = path.resolve(process.cwd(), '..', 'scripts');
        const configPath = path.join(baseDir, CONFIG_FILE);
        
        let config = {
            symbol: "AUTO",
            trainTestSplit: 0.8,
            initialBalance: 100000,
            totalTimesteps: 30000,
            lookbackWindow: 50,
            batchSize: 32,
            nSteps: 128,
            learningRate: 0.0003,
            gamma: 0.99,
            gaeLambda: 0.95,
            entCoef: 0.01,
            testSymbols: [],
            mode: "train"
        };
        
        if (existsSync(configPath)) {
            const existing = JSON.parse(readFileSync(configPath, 'utf8'));
            config = { ...config, ...existing };
        }
        
        return NextResponse.json(config);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        // Save to scripts folder
        const baseDir = path.resolve(process.cwd(), '..', 'scripts');
        const configPath = path.join(baseDir, CONFIG_FILE);
        
        const config = {
            symbol: data.symbol || "AUTO",
            trainTestSplit: parseFloat(data.trainTestSplit) || 0.8,
            initialBalance: parseFloat(data.initialBalance) || 100000,
            totalTimesteps: parseInt(data.totalTimesteps) || 30000,
            lookbackWindow: parseInt(data.lookbackWindow) || 50,
            batchSize: parseInt(data.batchSize) || 32,
            nSteps: parseInt(data.nSteps) || 128,
            learningRate: parseFloat(data.learningRate) || 0.0003,
            gamma: parseFloat(data.gamma) || 0.99,
            gaeLambda: parseFloat(data.gaeLambda) || 0.95,
            entCoef: parseFloat(data.entCoef) || 0.01,
            testSymbols: Array.isArray(data.testSymbols) ? data.testSymbols : [],
            mode: data.mode || "train"
        };
        
        writeFileSync(configPath, JSON.stringify(config, null, 2));
        
        return NextResponse.json({ success: true, config });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}