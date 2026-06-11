import { useEffect, useState } from "react";
import { getLeaderboard } from "../../api/traderApi.js";
import { toast } from "react-toastify";

const Leaderboard = () => {

    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const res = await getLeaderboard();
            setLeaders(res.data.leaderboard || []);
        } catch (error) {
            toast.error("Failed to load leaderboard");
        }
    };

    return (

        <div
            className="
                bg-white
                rounded-xl
                shadow
                p-5
                mb-8
            "
        >

            <h2
                className="
                    text-2xl
                    font-semibold
                    mb-4
                "
            >
                Top Traders
            </h2>

            <div className="space-y-3">

                {
                    leaders.map(
                        (
                            trader,
                            index
                        ) => (

                            <div
                                key={index}
                                className={`flex justify-between items-center border-b pb-2 ${trader.isCurrentUser ? 'bg-primary/5 rounded px-2 -mx-2 pt-2' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`text-lg font-bold ${trader.isCurrentUser ? 'text-primary' : ''}`}>
                                        #{index + 1}
                                    </span>
                                    <span className={trader.isCurrentUser ? 'font-semibold text-primary' : ''}>
                                        {trader.isCurrentUser ? "You" : trader.name}
                                    </span>
                                </div>
                                <span className={`font-semibold ${trader.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ₹{trader.pnl.toFixed(2)}
                                </span>
                            </div>
                        )
                    )
                }

            </div>

        </div>
    );
};

export default Leaderboard;