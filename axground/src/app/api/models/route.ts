import { NextResponse } from 'next/server';
import { readdirSync, existsSync, statSync, unlinkSync } from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const baseDir = path.resolve(process.cwd(), '..');
        const modelsDir = baseDir;
        
        const models: any[] = [];
        
        // Check for trained model files
        const modelFiles = ['ppo_nepse_agent.zip'];
        
        for (const file of modelFiles) {
            const modelPath = path.join(modelsDir, file);
            if (existsSync(modelPath)) {
                const stats = statSync(modelPath);
                models.push({
                    name: file.replace('.zip', ''),
                    created: stats.mtime.toISOString().split('T')[0],
                    episodes: 30000,
                    symbol: 'AUTO',
                    finalReward: 0,
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