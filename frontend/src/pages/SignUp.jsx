import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // ✅ ADDED

export const SignUp = () => {

  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ ADDED

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Role, setRole] = useState("user");

  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=])[A-Za-z\d@$!%*?&#^()_+\-=]{6,}$/;


    if (!emailPattern.test(Email)) {
      setError("Please enter valid email");
      setLoading(false);
      return;
    }

    if (!passwordPattern.test(Password)) {
      setError("Use 6+ chars with upper, lower, number & symbol.");
      setLoading(false);
      return;
    }

    if (Password !== ConfirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {

      // ✅ SIGNUP
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: Name,
          email: Email,
          password: Password,
          role: Role
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // ✅ AUTO LOGIN (IMPORTANT)
      const loginRes = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email: Email,
          password: Password
        })
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        throw new Error(loginData.message || "Login failed");
      }

      // ✅ store user properly
      login(loginData.user);

      // ✅ ROLE-BASED REDIRECT
      if (loginData.user.role === "provider") {
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

        <div className="bg-white border rounded-2xl p-8">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Create account</h1>
          </div>

          {Error && (
            <div className="text-red-500 mb-4">{Error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={Name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-950 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                placeholder="Email"
                required
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-950 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                placeholder="Password"
                required
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-950 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={ConfirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-950 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Role</label>
              <select
                value={Role}
                required
                onChange={(e) => setRole(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-950 outline-none"
              >
                <option value="user">User</option>
                <option value="provider">Provider</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-slate-950 text-white rounded-lg flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign up"}
            </button>

          </form>

          <p className="text-center mt-4">
            Already have an account? <Link to="/login" className="text-slate-950 font-medium hover:underline">Login</Link>
          </p>

        </div>

      </div>

    </div>
  );
};