import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
 
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import "./ShowListing.css";
 

function ShowListing() {
const { user, setUser, loading } = useAuth();
const { id } = useParams();
const [listing, setListing] = useState(null);
const [comment, setComment] = useState("");
const [rating, setRating] = useState(5);
const navigate = useNavigate();


useEffect(() => {
 
    async function fetchListing() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/Show/${id}`
        );

    if(!res.ok){
        const {message} = await res.json();
         toast.error(message)
        return 
    }
      const data = await res.json();
         setListing(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchListing();
  }, [id]);

if (!listing) return <p>Loading...</p>;

 
const handleComplete = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/isDone/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: true,
        }),
      }
    );

    if (!res.ok) {
     const data = await res.json();
     toast.error(data.message);
    return ;
    }
    const updatedTodo = await res.json();
  toast.success("Task completed successfully!");

    setListing(() =>
          updatedTodo
    );
  } catch (err) {
    console.error(err);
  }

 
};


const handleDelete = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/delete/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      const data = await res.json();
     toast.error(data.message);
    return ;
    }
   
toast.success("Listing deleted successfully")
navigate("/AllListings")
  } catch (err) {
    console.error(err);
  }
};


const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/review/create/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ comment, rating }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Review create nahi hua");
      }
      setComment("");
      setRating(5);
      toast.success("Review created successfully!");
setListing(data.updateListing);

     } catch (err) {
        toast.error(err.message)
     }
}


const handleDeleteReview = async (reviewId) => {
  try {
    const res = await fetch(
      `http://localhost:5000/review/deleteReview/${listing._id}/${reviewId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Delete failed");
    }

    // UI se deleted review turant remove karo

    setListing((prev) => ({
      ...prev,
      reviews: prev.reviews.filter(
        (review) => review._id !== reviewId
      ),
    }));
    toast.success("review deleted done!")

  } catch (err) {
    toast.error(err.message);
    // alert(err.message);
  }
};


return (

<> 
<div>
      <h1>{listing.title}</h1>
      <p>Created By : {listing.author.username}</p> <br />
      <p>{listing.completed ? "Complete" : "NoteComplete"}</p>
  
      <p>
  Created At: {new Date(listing.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  })}
</p>

<p>
  UpdatedAt At: {new Date(listing.updatedAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  })}
</p>
<br />

{user &&  (<> {user.username===listing.author.username && ( 
    <> 
    {!listing.completed && (
      <button onClick={() => handleComplete(listing._id)} style={{backgroundColor:"green"}}>
        Mark Complete
      </button>
    )}
{" "}
    <button style={{backgroundColor:"red"}} onClick={() => handleDelete(listing._id)}>Delete</button>{" "}
    <button style={{backgroundColor:"blue", color:"yellow"}}><Link to={`/Edit/${listing._id}`} style={{textDecoration:"none",color:"yellow"}}>Edit</Link></button>
</>
)}
</>)}
<p></p>

<br />
<hr />

{user && (<> 
<h2> Review...</h2>
  <form onSubmit={handleSubmit}>
      <label>Rating (1–5)</label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n} Star</option>
        ))}
      </select><h1></h1>
<p></p>
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
<p></p>
      <button type="submit">Submit Review</button>
    </form>
</>)}



 <div className="reviews-container">
  <h3>What people say</h3>

  <div className="reviews-grid">
{listing.reviews.map((review) => {
  return (
    <div key={review._id}>
      <div className="review-card">
        <h4>{review.author?.username || "Anonymous"}</h4>

        <p className="review-rating">
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </p>

        <p>{review.comment} <br />

        {user && (<> { user.username===review.author.username && (
          <button onClick={() => handleDeleteReview(review._id)}>
          Delete Review
        </button>)
        }</>)}

        </p>
        
      </div>

     
    </div>
  );
})}


  </div>
</div>


</div>
</>

)}


export default ShowListing;
