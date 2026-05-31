const StockModal = ({
    stock,
    onClose
}) => {

    if (!stock)
        return null;

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/50
                flex
                items-center
                justify-center
                z-50
            "
        >

            <div
                className="
                    bg-white
                    rounded-2xl
                    p-6
                    w-[95%]
                    md:w-[500px]
                    shadow-xl
                    relative
                "
            >

                <button
                    onClick={onClose}
                    className="
                        absolute
                        top-3
                        right-4
                        text-2xl
                        font-bold
                        text-gray-500
                        hover:text-red-500
                    "
                >
                    ×
                </button>

                <h2
                    className="
                        text-3xl
                        font-bold
                        mb-2
                    "
                >
                    {stock.symbol}
                </h2>

                <p
                    className="
                        text-gray-500
                        mb-4
                    "
                >
                    {stock.companyName}
                </p>

                <div
                    className="
                        space-y-3
                        text-lg
                    "
                >

                    <div
                        className="
                            flex
                            justify-between
                        "
                    >
                        <span>Current Price</span>

                        <span
                            className="
                                font-bold
                                text-green-600
                            "
                        >
                            ₹
                            {
                                stock.currentPrice
                            }
                        </span>
                    </div>

                    <div
                        className="
                            flex
                            justify-between
                        "
                    >
                        <span>Symbol</span>

                        <span>
                            {
                                stock.symbol
                            }
                        </span>
                    </div>

                    <div
                        className="
                            flex
                            justify-between
                        "
                    >
                        <span>Company</span>

                        <span>
                            {
                                stock.companyName
                            }
                        </span>
                    </div>

                </div>

                <div
                    className="
        mt-6
        rounded-xl
        overflow-hidden
        border
    "
                >

                    <div
                        className="
            p-3
            bg-slate-50
            border-b
            font-semibold
        "
                    >
                        Price Trend
                    </div>

                    <div className="p-3">

                        <div
                            className="
                h-40
                flex
                items-end
                justify-between
                gap-2
            "
                        >

                            {
                                [
                                    30,
                                    60,
                                    45,
                                    80,
                                    55,
                                    95,
                                    70
                                ].map(
                                    (
                                        bar,
                                        i
                                    ) => (

                                        <div
                                            key={i}
                                            className="
                                flex-1
                                bg-green-500
                                rounded-t
                            "
                                            style={{
                                                height:
                                                    `${bar}%`
                                            }}
                                        />
                                    )
                                )
                            }

                        </div>

                        <div
                            className="
                flex
                justify-between
                text-xs
                text-gray-400
                mt-2
            "
                        >
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default StockModal;