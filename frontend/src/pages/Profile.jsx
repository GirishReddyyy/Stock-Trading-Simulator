import { useState } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import { updateProfile, changePassword } from "../api/traderApi.js";
import { toast } from "react-toastify";

const Profile = () => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [loading, setLoading] = useState(false);

    // Password change states
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

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

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            setPasswordLoading(true);
            await changePassword({ currentPassword, newPassword });
            toast.success("Password changed successfully");
            
            // Reset fields
            setIsChangingPassword(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pb-bg font-['Inter'] pb-12 transition-colors duration-300">
            <Navbar />

            <div className="p-6 max-w-2xl mx-auto space-y-8 py-8">
                <div className="bg-pb-card rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.35)] border border-pb-border p-8">
                    <div className="flex justify-between items-center mb-8 border-b border-pb-border-divider pb-6">
                        <h1 className="text-3xl font-extrabold text-pb-text tracking-tight uppercase">
                            Your Profile
                        </h1>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2.5 bg-pb-surface text-pb-accent hover:bg-pb-accent hover:text-pb-bg font-bold text-xs uppercase tracking-widest rounded-lg transition-all border border-pb-border hover:border-transparent"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setName(user?.name || "");
                                    }}
                                    className="px-5 py-2.5 bg-pb-surface text-pb-text-muted hover:bg-pb-surface hover:text-pb-text font-bold text-xs uppercase tracking-widest rounded-lg transition-all border border-pb-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-5 py-2.5 bg-pb-accent text-pb-bg hover:bg-pb-accent-hover font-bold text-xs uppercase tracking-widest rounded-lg transition-all disabled:opacity-70 shadow-sm"
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="border-b border-pb-border-divider pb-6">
                            <p className="text-xs font-bold text-pb-text-sec uppercase tracking-wider mb-2">
                                Name
                            </p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-pb-bg border border-pb-border rounded-xl px-4 py-3 text-pb-text font-bold focus:outline-none focus:ring-2 focus:ring-pb-accent focus:border-transparent transition-all"
                                />
                            ) : (
                                <h3 className="text-xl font-bold text-pb-text tracking-wide">
                                    {user?.name || "User"}
                                </h3>
                            )}
                        </div>

                        <div className="border-b border-pb-border-divider pb-6">
                            <p className="text-xs font-bold text-pb-text-sec uppercase tracking-wider mb-2">
                                Email
                            </p>
                            <h3 className="text-xl font-bold text-pb-text tracking-wide">
                                {user?.email}
                            </h3>
                            <p className="text-xs font-semibold text-pb-text-muted mt-2 uppercase tracking-widest">Email cannot be changed.</p>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-pb-text-sec uppercase tracking-wider mb-3">
                                Role
                            </p>
                            <span className="inline-flex items-center px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest bg-pb-surface text-pb-accent border border-pb-border">
                                {user?.role || "Trader"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Password Change Section */}
                <div className="bg-pb-card rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.35)] border border-pb-border p-8">
                    <div className="flex justify-between items-center mb-8 border-b border-pb-border-divider pb-6">
                        <h2 className="text-2xl font-bold text-pb-text uppercase tracking-tight">
                            Security
                        </h2>
                        {!isChangingPassword && (
                            <button
                                onClick={() => setIsChangingPassword(true)}
                                className="px-5 py-2.5 bg-pb-surface text-pb-text-sec hover:bg-pb-surface hover:text-pb-text font-bold text-xs uppercase tracking-widest rounded-lg transition-all border border-pb-border"
                            >
                                Change Password
                            </button>
                        )}
                    </div>

                    {isChangingPassword && (
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-pb-text-sec uppercase tracking-wider mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-pb-bg border border-pb-border rounded-xl px-4 py-3 text-pb-text font-bold focus:outline-none focus:ring-2 focus:ring-pb-accent focus:border-transparent transition-all"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-pb-text-sec uppercase tracking-wider mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-pb-bg border border-pb-border rounded-xl px-4 py-3 text-pb-text font-bold focus:outline-none focus:ring-2 focus:ring-pb-accent focus:border-transparent transition-all"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-pb-text-sec uppercase tracking-wider mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-pb-bg border border-pb-border rounded-xl px-4 py-3 text-pb-text font-bold focus:outline-none focus:ring-2 focus:ring-pb-accent focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setCurrentPassword("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                    }}
                                    className="flex-1 py-3.5 bg-pb-surface text-pb-text-sec hover:bg-pb-surface hover:text-pb-text font-bold text-xs uppercase tracking-widest rounded-xl transition-all border border-pb-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="flex-1 py-3.5 bg-pb-accent text-pb-bg hover:bg-pb-accent-hover font-bold text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-70 shadow-sm"
                                >
                                    {passwordLoading ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;