import { useEffect, useState } from "react";

const NotificationCenter = () => {

    const [notifications,
        setNotifications] =
        useState([]);

    useEffect(() => {

        setNotifications([

            {
                text:
                    "BUY order executed for AAPL"
            },

            {
                text:
                    "TSLA moved +3.2%"
            },

            {
                text:
                    "Portfolio updated"
            }

        ]);

    }, []);

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
                Notifications
            </h2>

            <div className="space-y-3">

                {
                    notifications.map(
                        (
                            item,
                            index
                        ) => (

                            <div
                                key={index}
                                className="
                                    border-l-4
                                    border-green-500
                                    bg-slate-50
                                    p-3
                                    rounded
                                "
                            >
                                {item.text}
                            </div>
                        )
                    )
                }

            </div>

        </div>
    );
};

export default NotificationCenter;