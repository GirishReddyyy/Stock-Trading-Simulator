import { useEffect, useState } from "react";

const ThemeToggle = () => {

    const [dark,
        setDark] =
        useState(
            localStorage.getItem(
                "theme"
            ) === "dark"
        );

    useEffect(() => {

        if (dark) {

            document.documentElement
                .classList.add(
                    "dark"
                );

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            document.documentElement
                .classList.remove(
                    "dark"
                );

            localStorage.setItem(
                "theme",
                "light"
            );
        }

    }, [dark]);

    return (

        <button
            onClick={() =>
                setDark(
                    !dark
                )
            }
            className="
                px-4
                py-2
                rounded-lg
                bg-slate-800
                text-white
                hover:bg-slate-700
                transition
            "
        >
            {
                dark
                    ? "☀ Light"
                    : "🌙 Dark"
            }
        </button>
    );
};

export default ThemeToggle;