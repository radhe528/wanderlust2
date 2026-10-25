import { useState } from "react";
import { useNavigate } from "react-router-dom";
 
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL; 
function App() {
const navigate = useNavigate();

   const [title, setTitle] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);


   const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${backendUrl}/api/create`, {
        credentials: "include",
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      });

      if(!res.ok){
        const data = await res.json();
        throw new Error(data.message || "Could not create listing.");
      }
 
      toast.success("Listing created successfully!");
      setTitle("");
      navigate("/AllListings");
     } catch (err) {
       console.error(err);
       toast.error(err.message || "Failed to create listing!");
     } finally {
       setIsSubmitting(false);
     }
  };



  return (
    <section className="editor-panel">
      <p className="eyebrow">A fresh start</p>
      <h1>Create a listing</h1>
      <p>Capture what you want to get done. You can update it anytime.</p>

      <form className="app-form" onSubmit={addTodo}>
        <label className="form-field" htmlFor="Title">What would you like to work on?
        <input
          id="Title"
          type="text"
          placeholder="e.g. Plan a weekend getaway"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          required
        />
        </label>
        <button className="primary-button form-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : <>Create listing <span aria-hidden="true">→</span></>}
        </button>
      </form>
    </section>
  );
}

export default App;