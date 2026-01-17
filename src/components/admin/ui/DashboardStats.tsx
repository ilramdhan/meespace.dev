interface StatItem {
    label: string;
    value: string;
    change: string;
    changeType?: string; // e.g. 'neutral'
    icon: string;
    color: string;
}

export function DashboardStats({ stats }: { stats: StatItem[] }) {
    // Map color names to Tailwind classes dynamically-ish or just simple mapping
    const getColorClasses = (color: string, isLightBg = true) => {
        const map: Record<string, string> = {
            blue: isLightBg ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "",
            purple: isLightBg ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "",
            orange: isLightBg ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" : "",
            green: isLightBg ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" : "",
        };
        return map[color] || map["blue"];
    };

    const getChangeBadgeClasses = (change: string) => {
        if (change === "Today") {
            return "text-text-muted dark:text-gray-500 bg-gray-50 dark:bg-gray-800";
        }
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl p-6 flex flex-col justify-between h-36 border border-gray-100 dark:border-gray-800"
                >
                    <div className="flex items-start justify-between">
                        <div
                            className={`size-10 rounded-full flex items-center justify-center ${getColorClasses(stat.color)}`}
                        >
                            <span className="material-symbols-outlined">
                                {stat.icon}
                            </span>
                        </div>
                        <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${getChangeBadgeClasses(
                                stat.change
                            )}`}
                        >
                            {stat.change}
                        </span>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-text-main dark:text-white tracking-tight">
                            {stat.value}
                        </span>
                        <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                            {stat.label}
                        </p>
                    </div>
                </div>
            ))}
        </div >
    );
}
