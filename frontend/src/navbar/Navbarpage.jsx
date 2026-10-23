import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${backendUrl}/auth/Logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Logout failed");
      }

      setUser(null);
      toast.success(data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Logout failed");
    }
  };

  return (
    <header className="site-header">
      <div className="navbar-inner">
        <Link className="brand" to="/" aria-label="Wanderlist home">
          <span className="brand-mark">w</span>
          <span>Wanderlist<span className="brand-period">.</span></span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/AllListings" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            My listings
          </NavLink>
          {user && (
            <NavLink to="/NewListing" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
              Create new
            </NavLink>
          )}
        </nav>

        <div className="nav-account">
          {user ? (
            <>
              <span className="welcome-user">
                <span className="user-avatar">{user.username?.charAt(0).toUpperCase()}</span>
                <span className="welcome-label">Hi, {user.username}</span>
              </span>
              <button className="nav-logout" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link className="nav-login" to="/Login">Log in</Link>
              <Link className="primary-button nav-join" to="/Regiter">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
