import { useState } from "react";

const TradeHistoryFilters = ({
    onFilter
}) => {

    const [type,setType] =useState("");

    const [status,setStatus] =useState("");

    const applyFilter =
        () => {

            onFilter({
                type,
                status
            });
        };

    return (

        <div
            className="
                bg-white
                rounded-xl
                shadow
                p-5
                mb-5
                flex
                flex-col
                md:flex-row
                gap-4
                items-center
            "
        >

            <select
                value={type}
                onChange={(e) =>
                    setType(
                        e.target.value
                    )
                }
                className="
                    border
                    rounded-lg
                    px-4
                    py-2
                "
            >

                <option value="">
                    All Types
                </option>

                <option value="BUY">
                    BUY
                </option>

                <option value="SELL">
                    SELL
                </option>

            </select>

            <select
                value={status}
                onChange={(e) =>
                    setStatus(
                        e.target.value
                    )
                }
                className="
                    border
                    rounded-lg
                    px-4
                    py-2
                "
            >

                <option value="">
                    All Status
                </option>

                <option value="EXECUTED">
                    EXECUTED
                </option>

                <option value="PENDING">
                    PENDING
                </option>

                <option value="CANCELLED">
                    CANCELLED
                </option>

            </select>

            <button
                onClick={
                    applyFilter
                }
                className="
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    px-5
                    py-2
                    rounded-lg
                "
            >
                Apply
            </button>

        </div>
    );
};

export default TradeHistoryFilters;