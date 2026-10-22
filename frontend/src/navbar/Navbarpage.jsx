import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { NavLink } from "react-router-dom";
import "./Navbar.css"
const backendUrl = import.meta.env.VITE_BACKEND_URL; 


export default function Home() {
   const { user, setUser, loading } = useAuth();
    const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
  setUser(null);
      toast.success(data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Logout failed");
    }
  };
  
   return (
    <div >
      <NavLink to="/" className="nav-link">
        Home
      </NavLink>
        <NavLink to="/AllListings" className="nav-link">
        All listings
      </NavLink>

      {user && (<> 
         <NavLink to="/NewListing" className="nav-link">
        CreateNewListing
      </NavLink>
 </>) 
} <p></p>
      {user ? (
        <>
          <span>Welcome, {user.username}</span><p></p>
          <button onClick={handleLogout} style={{backgroundColor:"red"}} >Logout</button>
        </>
      ) : (
        <>
          <Link to="/Login">Login</Link><p></p>
          <Link to="/Regiter">Register</Link>
        </>
      )}

      </div>
  );
}