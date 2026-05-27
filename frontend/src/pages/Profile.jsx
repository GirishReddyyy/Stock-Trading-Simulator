import Navbar from "../components/Navbar.jsx";

const Profile = () => {

    const user =
        JSON.parse(
            localStorage.getItem(
                "user"
            )
        );

    return (

        <div className="min-h-screen bg-slate-100">

            <Navbar />

            <div
                className="
                    p-6
                    max-w-2xl
                    mx-auto
                "
            >

                <div
                    className="
                        bg-white
                        rounded-xl
                        shadow
                        p-6
                    "
                >

                    <h1
                        className="
                            text-3xl
                            font-bold
                            mb-6
                        "
                    >
                        Profile
                    </h1>

                    <div className="space-y-4">

                        <div>

                            <p
                                className="
                                    text-gray-500
                                "
                            >
                                Name
                            </p>

                            <h3
                                className="
                                    text-lg
                                    font-semibold
                                "
                            >
                                {
                                    user?.name ||
                                    "User"
                                }
                            </h3>

                        </div>

                        <div>

                            <p
                                className="
                                    text-gray-500
                                "
                            >
                                Email
                            </p>

                            <h3
                                className="
                                    text-lg
                                    font-semibold
                                "
                            >
                                {
                                    user?.email
                                }
                            </h3>

                        </div>

                        <div>

                            <p
                                className="
                                    text-gray-500
                                "
                            >
                                Role
                            </p>

                            <h3
                                className="
                                    text-lg
                                    font-semibold
                                    capitalize
                                "
                            >
                                {
                                    user?.role
                                }
                            </h3>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Profile;