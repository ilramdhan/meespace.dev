import { BentoCard } from "@/components/public/BentoCard";
import { Users, FileText, Eye, MousePointerClick } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                <div className="text-sm text-text-muted">Last updated: Just now</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Views", value: "12,345", icon: Eye, change: "+12% from last month" },
                    { title: "Project Clicks", value: "450", icon: MousePointerClick, change: "+5% from last month" },
                    { title: "Active Projects", value: "12", icon: FileText, change: "2 ongoing" },
                    { title: "Messages", value: "24", icon: Users, change: "+3 new today" }
                ].map((stat) => (
                    <BentoCard key={stat.title} className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-text-muted">{stat.title}</span>
                            <stat.icon className="h-4 w-4 text-text-muted" />
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-text-muted mt-1">{stat.change}</p>
                    </BentoCard>
                ))}
            </div>

            {/* Recent Activity / Content Placeholder */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <BentoCard className="col-span-4 p-6">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                                <div className="size-8 rounded-full bg-primary/20" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Updated "E-commerce API" project</p>
                                    <p className="text-xs text-text-muted">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </BentoCard>
                <BentoCard className="col-span-3 p-6">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="flex flex-col gap-2">
                        <button className="w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-muted text-sm transition-colors">
                            + Add New Project
                        </button>
                        <button className="w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-muted text-sm transition-colors">
                            + Write New Blog Post
                        </button>
                        <button className="w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-muted text-sm transition-colors">
                            View Messages
                        </button>
                    </div>
                </BentoCard>
            </div>
        </div>
    );
}
