import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL; 


function App() {
const { user, loading: authLoading } = useAuth();
const navigate = useNavigate();
const { id } = useParams();
const [isLoading, setIsLoading] = useState(true);
const [loadError, setLoadError] = useState("");

useEffect(() => {
  if (!authLoading && !user) {
    toast.error("Log in first to edit listing");
     navigate(`/ShowListing/${id}`, { replace: true });
  }
}, [user, authLoading, id, navigate]);

const [liting, setLiting] = useState({});
  
useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`${backendUrl}/api/Show/${id}`);

        if (!res.ok) {
          throw new Error("Listing not found");
        }

        const data = await res.json();
        setLiting(data);
      } catch (err) {
        console.error(err);
        setLoadError(err.message || "Could not load this listing.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchListing();
}, [id]);

let add = (e) => {
setLiting((pre)=> {return {...pre,[e.target.name]: e.target.value}})
}

const addTodo = async (e) => {
    e.preventDefault();
     if (!(liting.title || "").trim()) return;

    try {
      const res = await fetch(`${backendUrl}/api/Edit/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ liting })
      });

    if (!res.ok) {
     const data = await res.json();
     toast.error(data.message);
    return ;
    }

      await res.json();
       toast.success("Listing Edited successfully")
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not update listing.");
      return;
    }
    navigate(`/ShowListing/${id}`);
};

   return (
    <section className="editor-panel">
      <p className="eyebrow">Make it yours</p>
      <h1>Edit listing</h1>
      <p>Give your plan a quick update.</p>
      {isLoading ? <p className="loading-state">Loading listing…</p> : loadError ? (
        <div className="error-state"><h2>Couldn’t load this listing</h2><p>{loadError}</p></div>
      ) : (
        <form className="app-form" onSubmit={addTodo}>
          <label className="form-field" htmlFor="edit-title">Listing title
            <input
              id="edit-title"
              type="text"
              name="title"
              placeholder="What are you working on?"
              value={liting.title || ""}
              onChange={add}
              maxLength={120}
              required
            />
          </label>
          <button className="primary-button form-submit" type="submit">Save changes</button>
        </form>
      )}
    </section>
  );
}

export default App;