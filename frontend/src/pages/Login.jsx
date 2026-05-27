import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-slate-100
            "
    >
      <div
        className="
                    bg-white
                    p-8
                    rounded-2xl
                    shadow-lg
                    w-full
                    max-w-md
                "
      >
        <h1
          className="
                        text-3xl
                        font-bold
                        text-center
                        text-slate-800
                        mb-2
                    "
        >
          TradeSim
        </h1>

        <p
          className="
                        text-center
                        text-gray-500
                        mb-6
                    "
        >
          Login to your account
        </p>

        <form
          onSubmit={handleLogin}
          className="
                        space-y-4
                    "
        >
          <div>
            <label
              className="
                                block
                                text-sm
                                font-medium
                                mb-1
                            "
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                                w-full
                                border
                                rounded-lg
                                px-4
                                py-2
                                focus:outline-none
                                focus:ring-2
                                focus:ring-green-500
                            "
              placeholder="Enter email"
            />
          </div>

          <div>
            <label
              className="
                                block
                                text-sm
                                font-medium
                                mb-1
                            "
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                                w-full
                                border
                                rounded-lg
                                px-4
                                py-2
                                focus:outline-none
                                focus:ring-2
                                focus:ring-green-500
                            "
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
                            w-full
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            py-2
                            rounded-lg
                            transition
                            duration-200
                            disabled:opacity-50
                        "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
