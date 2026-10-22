import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL; 


function App() {
const {user} = useAuth();
const navigate = useNavigate();
const { id } = useParams();

useEffect(() => {
  if (!user) {
    toast.error("Log in first to edit listing");
     navigate(`/ShowListing/${id}`, { replace: true });
  }
}, [user, navigate]);

const [liting, setLiting] = useState({});
  
useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`${backendUrl}/api/Show/${id}`);

        if (!res.ok) {
          throw new Error("Listing not found");
        }

        const data = await res.json();
        // console.log(data)
        setLiting(data);
      } catch (err) {
        console.error(err);
      }
    }
// console.log(title)
    fetchListing();
}, [id]);

let add = (e) => {
setLiting((pre)=> {return {...pre,[e.target.name]: e.target.value}})
}

const addTodo = async (e) => {
    e.preventDefault();
     if (!((liting.title).trim())) return;

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

      const newTodo = await res.json();
       toast.success("Listing Edited successfully")
 
       setLiting("");
    } catch (err) {
      console.error(err);
    }
    navigate(`/ShowListing/${id}`);
};

   return (
    <>
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h1>Edit Todo </h1>

      <form onSubmit={addTodo}>
        <input
          type="text"
          name="title"
          placeholder="Enter a todo..."
          value={liting.title || ""}
          onChange={add}
        />
<p></p><br />

        <button type="submit" style={{backgroundColor:"green", color:"red"}}>Submit</button>
      </form>
      <br />
    </div> </>
  );
}

export default App;