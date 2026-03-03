import { Sidebar } from "./sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-background min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
