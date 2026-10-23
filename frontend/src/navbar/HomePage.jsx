import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <section className="home-hero">
      <div className="hero-copy">
        <span className="hero-pill"><span className="hero-pill-dot" /> Make room for what matters</span>
        <h1>Small steps.<br /><span>Big momentum.</span></h1>
        <p>
          Keep your ideas, plans, and everyday tasks in one calm place.
          Focus on what’s next and enjoy the progress you make along the way.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to={user ? "/NewListing" : "/Regiter"}>
            {user ? "Create your first listing" : "Start organizing"} <span aria-hidden="true">→</span>
          </Link>
          <Link className="hero-secondary-link" to="/AllListings">Explore listings <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="hero-note">
          <div className="avatar-stack" aria-hidden="true"><span>✓</span><span>✦</span><span>↗</span></div>
          <span>A little clarity goes a long way.</span>
        </div>
      </div>

      <div className="hero-visual" aria-label="A preview of an organized task list">
        <div className="visual-orbit orbit-one" />
        <div className="visual-orbit orbit-two" />
        <div className="floating-spark spark-one">✳</div>
        <div className="floating-spark spark-two">✦</div>
        <div className="preview-card">
          <div className="preview-topline"><span className="preview-dot" /> YOUR SPACE <span className="preview-menu">•••</span></div>
          <h2>Today, at your pace</h2>
          <p className="preview-subtitle">A few things worth doing</p>
          <div className="preview-task"><span className="task-check checked">✓</span><span><strong>Plan the week</strong><small>Make time for the important bits</small></span></div>
          <div className="preview-task"><span className="task-check" /><span><strong>Finish a good read</strong><small>One chapter is a great start</small></span></div>
          <div className="preview-task"><span className="task-check" /><span><strong>Get outside</strong><small>A fresh perspective awaits</small></span></div>
          <div className="preview-progress"><span><i /></span><small>1 of 3 complete</small></div>
        </div>
        <div className="floating-note"><span>✦</span> Progress, not perfection</div>
      </div>
    </section>
  );
}
