interface AnalyticsData {
    days: string[];
    values: number[];
}

export function VisitorAnalytics({ data }: { data: AnalyticsData }) {
    return (
        <div className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 flex-1">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-text-main dark:text-white">
                    Visitor Analytics
                </h3>
                <select className="bg-gray-50 dark:bg-gray-800 border-none text-xs rounded-lg px-2 py-1 text-text-muted focus:ring-0 cursor-pointer">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                </select>
            </div>
            <div className="h-48 w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-end justify-between px-4 pb-0 pt-8 gap-2">
                {data.values.map((val, idx) => (
                    <div
                        key={idx}
                        className={`w-full rounded-t-lg transition-colors relative group ${val === 95
                            ? "bg-sage-green shadow-lg hover:bg-sage-green/90"
                            : "bg-sage-green/20 hover:bg-sage-green/40"
                            }`}
                        style={{ height: `${val}%` }}
                    >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                            {val}%
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-text-muted dark:text-gray-500 px-1">
                {data.days.map((day, idx) => (
                    <span key={idx}>{day}</span>
                ))}
            </div>
        </div>
    );
}
