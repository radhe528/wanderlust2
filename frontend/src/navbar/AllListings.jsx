import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function AllListings() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    fetch(`${backendUrl}/api/find`)
      .then((res) => {
        if (!res.ok) throw new Error("We couldn’t load your listings. Please try again.");
        return res.json();
      })
      .then((data) => {
        if (isCurrent) setTodos(data);
      })
      .catch((err) => {
        console.error(err);
        if (isCurrent) setError(err.message);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <section>
      <div className="page-heading listings-toolbar">
        <div>
          <p className="eyebrow">Your collection</p>
          <h1>All listings</h1>
          <p>Everything you’re working on, gathered in one place.</p>
        </div>
        <Link className="primary-button" to={user ? "/NewListing" : "/Login"}>
          {user ? "＋ Create listing" : "＋ Sign in to create"}
        </Link>
      </div>

      {loading ? (
        <p className="loading-state">Gathering your listings…</p>
      ) : error ? (
        <div className="error-state"><h2>Couldn’t load listings</h2><p>{error}</p></div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <h2>Your next idea starts here</h2>
          <p>Create a listing to get your plans moving.</p>
          <Link className="primary-button" to={user ? "/NewListing" : "/Login"} style={{ marginTop: 18 }}>
            {user ? "Create your first listing" : "Sign in to create a listing"}
          </Link>
        </div>
      ) : (
        <div className="listing-grid">
          {todos.map((todo) => (
            <Link className="listing-card" key={todo._id} to={`/ShowListing/${todo._id}`}>
              <div className="listing-card-top">
                <span className={`status-badge${todo.completed ? " complete" : ""}`}>
                  {todo.completed ? "Completed" : "In progress"}
                </span>
                <span className="listing-arrow" aria-hidden="true">↗</span>
              </div>
              <h2>{todo.title}</h2>
              <p>{todo.completed ? "Nicely done. This one is complete." : "A little progress is still progress."}</p>
              <div className="listing-meta">
                <span className="listing-meta-avatar">{todo.author?.username?.charAt(0).toUpperCase() || "W"}</span>
                <span>{todo.author?.username || "Your listing"}</span>
                {todo.createdAt && <><span>·</span><span>{new Date(todo.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span></>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default AllListings;
