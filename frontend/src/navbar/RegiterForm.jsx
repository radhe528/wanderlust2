import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL; 



export default function Register() {
  const navigate = useNavigate();
const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
       `${backendUrl}/auth/register`,
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
        throw new Error(data.message || "Registration failed");
      }
setUser(data.user);
      toast.success(data.message);
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-intro">
        <p className="eyebrow">Make a little space</p>
        <h2>Good things start with a simple plan.</h2>
        <p>Create a free account to keep all your ideas and everyday wins together.</p>
        <div className="auth-benefit"><span className="auth-benefit-mark">✦</span> Start where you are. Build from there.</div>
      </div>
      <div className="auth-card">
        <p className="eyebrow">Get started</p>
        <h1>Create your account</h1>
        <p className="auth-subtitle">A few details and you’re ready to go.</p>
        <form className="app-form" onSubmit={handleSubmit}>
          <label className="form-field" htmlFor="register-username">Username
            <input
              id="register-username"
              name="username"
              placeholder="Choose a username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-field" htmlFor="register-email">Email address
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-field" htmlFor="register-password">Password
            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </label>
          <button className="primary-button form-submit" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/Login">Sign in</Link></p>
      </div>
    </section>
  );
}