import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import path from 'path';

const PYTHON = '/home/arwin/codes/projects/Axground/venv/bin/python';
const SCRIPTS_DIR = '/home/arwin/codes/projects/Axground/scripts';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const action = data.action;

        let command = '';

        if (action === 'train') {
            command = `${PYTHON} ${SCRIPTS_DIR}/train_agent.py`;
        } else if (action === 'backtest') {
            // Clear old trades before backtest
            const baseDir = path.resolve(process.cwd(), '..');
            const tradePath = path.join(baseDir, 'axground', 'public', 'trade-history.json');
            const logPath = path.join(baseDir, 'axground', 'public', 'training-logs.json');
            
            // Clear trade history to start fresh
            if (existsSync(tradePath)) {
                writeFileSync(tradePath, '[]');
            }
            
            command = `${PYTHON} ${SCRIPTS_DIR}/backtest_agent.py`;
        } else if (action === 'stop') {
            command = 'pkill -f train_agent.py || pkill -f backtest_agent.py || true';
        }

        if (command) {
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error executing ${action}:`, err);
                }
            });
            return NextResponse.json({ success: true, message: `Dispatched ${action}` });
        }

        return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
    } catch (e: any) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}
