import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// SVG Icons
const ShieldCheckIcon = () => (
  <svg className="w-5 h-5 text-pb-accent inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ChartMotif = () => (
  <svg className="absolute bottom-0 left-0 w-full h-64 text-pb-border/50 pointer-events-none" viewBox="0 0 1440 320" preserveAspectRatio="none">
    <path fill="currentColor" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,213.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://stock-trading-simulator-0tby.onrender.com" : "http://localhost:5000");
      const res = await axios.post(`${apiUrl}/api/auth/register`, {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-['Inter'] bg-pb-bg">
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
      
      {/* Radial Lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pb-accent opacity-[0.05] blur-[100px] pointer-events-none"></div>

      <ChartMotif />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-pb-text tracking-tight mb-2 flex items-center justify-center gap-2">
            Trade<span className="text-pb-accent">Sim</span>
          </h1>
          <p className="text-pb-text-muted text-sm uppercase tracking-widest font-semibold">Wealth Management</p>
        </div>

        <div className="bg-pb-card border border-pb-border rounded-[24px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative">
          <div className="flex items-center justify-center mb-8 pb-4 border-b border-pb-border-divider">
            <ShieldCheckIcon />
            <span className="text-pb-text font-semibold text-lg tracking-wide">Create Account</span>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-pb-text-sec uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-pb-surface border border-pb-border rounded-xl px-4 py-3 text-pb-text placeholder:text-pb-text-disabled hover:border-pb-border-hover focus:border-pb-accent focus:ring-[2px] focus:ring-pb-accent/20 focus:outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-pb-text-sec uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-pb-surface border border-pb-border rounded-xl px-4 py-3 text-pb-text placeholder:text-pb-text-disabled hover:border-pb-border-hover focus:border-pb-accent focus:ring-[2px] focus:ring-pb-accent/20 focus:outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-pb-text-sec uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-pb-surface border border-pb-border rounded-xl px-4 py-3 text-pb-text placeholder:text-pb-text-disabled hover:border-pb-border-hover focus:border-pb-accent focus:ring-[2px] focus:ring-pb-accent/20 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-6 bg-pb-accent hover:bg-pb-accent-hover text-pb-bg font-bold rounded-xl shadow-[0_4px_14px_rgba(212,163,115,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
            >
              {loading ? "Creating Account..." : "Start Trading"}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-pb-text-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-pb-accent hover:text-pb-accent-hover font-semibold transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
