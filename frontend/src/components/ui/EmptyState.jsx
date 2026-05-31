const EmptyState = ({
    title,
    subtitle
}) => {

    return (

        <div
            className="
                bg-white
                rounded-xl
                shadow
                p-10
                text-center
            "
        >

            <div
                className="
                    text-5xl
                    mb-3
                "
            >
                📭
            </div>

            <h2
                className="
                    text-xl
                    font-semibold
                    text-slate-700
                "
            >
                {title}
            </h2>

            <p
                className="
                    text-slate-500
                    mt-2
                "
            >
                {subtitle}
            </p>

        </div>
    );
};

export default EmptyState;