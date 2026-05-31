import { useState } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import { updateProfile } from "../api/traderApi.js";
import { toast } from "react-toastify";

const Profile = () => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        try {
            setLoading(true);
            const res = await updateProfile({ name });
            const updatedUser = res.data.user;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />

            <div className="p-6 max-w-2xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                            Your Profile
                        </h1>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 font-semibold rounded-lg transition-colors"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setName(user?.name || "");
                                    }}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-4 py-2 bg-primary text-white hover:bg-primary/90 font-semibold rounded-lg transition-colors disabled:opacity-70"
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                Name
                            </p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            ) : (
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                    {user?.name || "User"}
                                </h3>
                            )}
                        </div>

                        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                Email
                            </p>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                {user?.email}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                Role
                            </p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary capitalize">
                                {user?.role || "Trader"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;