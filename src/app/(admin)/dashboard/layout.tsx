import { AdminSidebar } from "@/components/admin/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full">
            <AdminSidebar />
            <div className="flex flex-col md:pl-64">
                {/* Header/Top nav could go here if needed, for mobile menu trigger */}
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
                    {/* Mobile Sidebar Trigger would go here */}
                    <span className="font-bold">CMS Admin</span>
                </header>
                <main className="flex-1 p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
