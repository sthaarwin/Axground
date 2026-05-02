import { NextResponse } from 'next/server';
import { readdirSync, existsSync, statSync, unlinkSync, readFileSync } from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const baseDir = path.resolve(process.cwd(), '..');
        const modelFiles = ['ppo_nepse_agent.zip'];
        
        const models: any[] = [];
        
        for (const file of modelFiles) {
            const modelPath = path.join(baseDir, file);
            if (existsSync(modelPath)) {
                const stats = statSync(modelPath);
                
                // Try to read training logs for reward info
                const logPath = path.join(baseDir, 'axground', 'public', 'training-logs.json');
                let finalReward = 0;
                let episodes = 0;
                let symbol = 'NIMB';
                
                if (existsSync(logPath)) {
                    try {
                        const logData = JSON.parse(readFileSync(logPath, 'utf8'));
                        finalReward = logData.meanReward || 0;
                        episodes = logData.episodes || 30000;
                        symbol = logData.symbol || 'AUTO';
                    } catch (e) {}
                }
                
                models.push({
                    name: file.replace('.zip', ''),
                    created: stats.mtime.toISOString().split('T')[0],
                    episodes: episodes,
                    symbol: symbol,
                    finalReward: finalReward,
                    status: 'trained'
                });
            }
        }
        
        return NextResponse.json({ models });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const deleteName = searchParams.get('delete');
        
        if (deleteName) {
            const baseDir = path.resolve(process.cwd(), '..');
            const modelPath = path.join(baseDir, deleteName + '.zip');
            if (existsSync(modelPath)) {
                unlinkSync(modelPath);
            }
        }
        
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}