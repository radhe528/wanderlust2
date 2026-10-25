import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL; 


export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${backendUrl}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
setUser(data.user);
      toast.success(data.message);
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-intro">
        <p className="eyebrow">Welcome back</p>
        <h2>Your plans are right where you left them.</h2>
        <p>Sign in and pick up where you left off. One small step can change your whole day.</p>
        <div className="auth-benefit"><span className="auth-benefit-mark">✓</span> Your space, your pace, your progress.</div>
      </div>
      <div className="auth-card">
        <p className="eyebrow">Sign in</p>
        <h1>Good to see you</h1>
        <p className="auth-subtitle">Enter your details to continue to your account.</p>
        <form className="app-form" onSubmit={handleSubmit}>
          <label className="form-field" htmlFor="login-username">Username
            <input
              id="login-username"
              name="username"
              placeholder="Your username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-field" htmlFor="login-password">Password
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Your password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <button className="primary-button form-submit" disabled={loading} type="submit">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="auth-switch">New to Wanderlist? <Link to="/Regiter">Create an account</Link></p>
      </div>
    </section>
  );
}