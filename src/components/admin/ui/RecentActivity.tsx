interface ActivityItem {
    title: string;
    description: string;
    time: string;
    icon: string;
    color: string;
}

export function RecentActivity({ activity }: { activity: ActivityItem[] }) {
    const getColorClasses = (color: string) => {
        const map: Record<string, string> = {
            blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
            green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
            orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
            purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
            gray: "bg-gray-100 dark:bg-gray-800 text-gray-500",
        };
        return map[color] || map["gray"];
    };

    return (
        <div className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl p-6 h-full border border-gray-100 dark:border-gray-800 flex flex-col">
            <h3 className="font-bold text-text-main dark:text-white mb-6">
                Recent Activity
            </h3>
            <div className="space-y-6 relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-gray-100 dark:bg-gray-800"></div>
                {activity.map((item, idx) => (
                    <div key={idx} className="relative pl-12">
                        <div
                            className={`absolute left-0 top-1 size-10 rounded-full flex items-center justify-center border-4 border-white dark:border-[#1e1e1e] ${getColorClasses(
                                item.color
                            )}`}
                        >
                            <span className="material-symbols-outlined text-sm">
                                {item.icon}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-main dark:text-white">
                                {item.title}
                            </p>
                            <p className="text-xs text-text-muted dark:text-gray-400 mt-0.5">
                                {item.description}
                            </p>
                            <span className="text-[10px] text-gray-400 mt-2 block">
                                {item.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-auto pt-6 text-sm font-semibold text-sage-green hover:text-[#789586] transition-colors cursor-pointer">
                View Full Activity Log
            </button>
        </div>
    );
}
