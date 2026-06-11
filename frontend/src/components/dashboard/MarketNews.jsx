import { useEffect, useState } from "react";

const MarketNews = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const dummyNews = [
            { title: "Tech stocks rally as market opens higher", sentiment: "Bullish", time: "10m ago" },
            { title: "Investors cautious over inflation data", sentiment: "Neutral", time: "1h ago" },
            { title: "Energy sector faces selling pressure", sentiment: "Bearish", time: "2h ago" },
            { title: "Central bank hints at rate cuts next quarter", sentiment: "Bullish", time: "4h ago" }
        ];
        setNews(dummyNews);
    }, []);

    return (
        <div className="bg-pb-card border border-pb-border rounded-2xl shadow-sm overflow-hidden h-full">
            <div className="divide-y divide-pb-border-divider">
                {news.map((item, index) => (
                    <div key={index} className="px-5 py-4 hover:bg-pb-card-hover transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-pb-text group-hover:text-pb-accent transition-colors text-sm tracking-wide">
                                {item.title}
                            </h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                item.sentiment === "Bullish" ? "bg-pb-profit/15 text-pb-profit" :
                                item.sentiment === "Bearish" ? "bg-pb-loss/15 text-pb-loss" :
                                "bg-pb-surface text-pb-text-sec border border-pb-border"
                            }`}>
                                {item.sentiment}
                            </span>
                            <span className="text-xs font-semibold text-pb-text-muted uppercase tracking-widest">
                                {item.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketNews;