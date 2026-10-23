import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
 
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL; 
 


function ShowListing() {
const { user } = useAuth();
const { id } = useParams();
const [listing, setListing] = useState(null);
const [loadError, setLoadError] = useState("");
const [comment, setComment] = useState("");
const [rating, setRating] = useState(5);
const navigate = useNavigate();


useEffect(() => {
 
    async function fetchListing() {
      try {
        const res = await fetch(
          `${backendUrl}/api/Show/${id}`
        );

    if(!res.ok){
        const data = await res.json();
        throw new Error(data.message || "Could not load this listing.");
    }
      const data = await res.json();
         setListing(data);
      } catch (err) {
        console.error(err);
        setLoadError(err.message || "Could not load this listing.");
      }
    }

    fetchListing();
  }, [id]);

if (!listing) {
  return loadError ? (
    <div className="error-state"><h2>Couldn’t load this listing</h2><p>{loadError}</p><Link to="/AllListings">Back to listings</Link></div>
  ) : <p className="loading-state">Loading listing…</p>;
}

 
const handleComplete = async (id) => {
  try {
    const res = await fetch(
      `${backendUrl}/api/isDone/${id}`,
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

    setListing((currentListing) => ({
      ...currentListing,
      completed: updatedTodo.completed,
    }));
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Could not complete listing.");
  }

 
};


const handleDelete = async (id) => {
  try {
    const res = await fetch(
      `${backendUrl}/api/delete/${id}`,
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
    toast.error(err.message || "Could not delete listing.");
  }
};


const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${backendUrl}/review/create/${id}`,
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
      `${backendUrl}/review/deleteReview/${listing._id}/${reviewId}`,
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
  <section className="detail-panel">
    <article className="detail-card">
      <p className="eyebrow">Your listing</p>
      <div className="detail-status-row">
        <span className={`status-badge${listing.completed ? " complete" : ""}`}>
          {listing.completed ? "Completed" : "In progress"}
        </span>
        <span className="detail-author">
          <span className="listing-meta-avatar">{listing.author?.username?.charAt(0).toUpperCase() || "W"}</span>
          Created by {listing.author?.username || "Unknown"}
        </span>
      </div>
      <h1 className="detail-title">{listing.title}</h1>

      <div className="detail-dates">
        <div className="detail-date">
          <span>Created</span>
          <strong>{new Date(listing.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</strong>
        </div>
        <div className="detail-date">
          <span>Last updated</span>
          <strong>{new Date(listing.updatedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</strong>
        </div>
      </div>

      {user?.username === listing.author?.username && (
        <div className="detail-actions">
          {!listing.completed && (
            <button className="primary-button" onClick={() => handleComplete(listing._id)}>
              ✓ Mark complete
            </button>
          )}
          <Link className="secondary-button" to={`/Edit/${listing._id}`}>Edit listing</Link>
          <button className="danger-button" onClick={() => handleDelete(listing._id)}>Delete listing</button>
        </div>
      )}
    </article>

    <section className="review-section">
      <h2>Share a thought</h2>
      {user ? (
        <form className="review-form" onSubmit={handleSubmit}>
          <label className="form-field" htmlFor="review-rating">Your rating
            <select id="review-rating" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} {n === 1 ? "star" : "stars"}</option>)}
            </select>
          </label>
          <label className="form-field" htmlFor="review-comment">Your review
            <textarea
              id="review-comment"
              placeholder="What would you like to share?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </label>
          <button className="primary-button" type="submit">Post review</button>
        </form>
      ) : (
        <p className="auth-subtitle">Sign in to leave a review.</p>
      )}

      <div className="reviews-container">
        <h3>{listing.reviews.length ? "Community notes" : "No reviews yet — you can be the first."}</h3>
        <div className="reviews-grid">
          {listing.reviews.map((review) => (
            <article className="review-card" key={review._id}>
              <h4>{review.author?.username || "Anonymous"}</h4>
              <p className="review-rating" aria-label={`${review.rating} out of 5 stars`}>
                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
              </p>
              <p>{review.comment}</p>
              {user?.username === review.author?.username && (
                <button className="review-delete" onClick={() => handleDeleteReview(review._id)}>Delete review</button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  </section>
);
}


export default ShowListing;
