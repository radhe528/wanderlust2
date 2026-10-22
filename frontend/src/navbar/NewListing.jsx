import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL; 
function App() {
const navigate = useNavigate();
const {user} = useAuth();

   const [title, setTitle] = useState("");


   const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
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
        const {message} = await res.json();
        toast.error(message);
        return;
      }
 
  toast.success("Listing created successfully!");
        setTitle("");
     } catch (err) {
       console.error(err);
        toast.error("Failed to create listing!");
     }
      navigate("/AllListings");
  };



  return (
    <>

    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h1>My Todo List</h1>

      <form onSubmit={addTodo}>
        <label htmlFor="Title" >Enter Title</label>{" "}
        <input
          id="Title"
          type="text"
          placeholder="Enter a todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}/>{" "}

        <button type="submit" style={{backgroundColor:"green", color:"red"}}>Add Todo</button>
      </form>
      <br />
 
    </div> </>
  );
}

export default App;