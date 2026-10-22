import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL; 

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  // Backend se todos fetch karna
  useEffect(() => {
        fetch(`${backendUrl}/api/find`)

    // fetch("http://localhost:5000/api/find")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch todos");
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch((err) => console.error(err));
  }, []);

  // Naya todo create karna
  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const res = await fetch(`${backendUrl}/api/todos`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      });

      if (!res.ok) throw new Error("Failed to add todo");

      const newTodo = await res.json();

      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <> 

{todos.map((todo) => {
return ( 
    <div key={todo._id}  >
     <h2 style={{color: (todo.completed && "red")}}>{todo.title}</h2> 
     <Link to={`/ShowListing/${todo._id}`}><button style={{color:"yellow"}}  >See</button> </Link>  
     <p></p><br />
    </div>
     )     
})}
    
    </>
  );
}

export default App;