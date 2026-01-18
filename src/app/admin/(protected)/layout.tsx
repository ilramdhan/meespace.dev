import { AdminSidebar } from "@/components/admin/ui/AdminSidebar";
import { ToastProvider } from "@/components/shared/Toast";
import { requireAdmin } from "@/lib/auth";

export default async function AdminProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This will redirect to login if not authenticated or not an admin
    await requireAdmin();

    return (
        <ToastProvider>
            <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden">
                <AdminSidebar />
                <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto pb-8">
                        {children}
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}
