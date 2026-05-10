import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=])[A-Za-z\d@$!%*?&#^()_+\-=]{6,}$/;

    if (!emailPattern.test(email)) {
      setError("Please enter valid email");
      setLoading(false);
      return;
    }

    if (!passwordPattern.test(password)) {
      setError("Use 6+ chars with upper, lower, number & symbol.");
      setLoading(false);
      return;
    }

    try {

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ store user
      login(data.user);

      // ✅ ROLE-BASED REDIRECT
      if (data.user.role === "provider") {
        navigate("/provider-dashboard");
      } else {
        navigate("/user-dashboard");
      }

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC]">

      <div className="w-full max-w-md">

        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Log in to your EventBook account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-950 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-950 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-slate-950 text-white rounded-lg flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log in"}
            </button>

          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-slate-950 font-medium hover:underline">
              Sign up
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};