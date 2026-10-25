import Navbar from "./navbar/Navbarpage.jsx"
import { Routes, Route } from "react-router-dom";
import AllListings from "./navbar/AllListings.jsx"
import NewListing from "./navbar/NewListing.jsx"
import ShowListing from "./navbar/ShowListing.jsx"
import Homepage from "./navbar/HomePage.jsx"
import Edit from "./navbar/EditForm.jsx"
import { Toaster } from "react-hot-toast"; 
import RegisterFormPage from "./navbar/RegiterForm.jsx"
import LoginFormPage from "./navbar/LoginPage.jsx"

const AllListing =  ()=>{
 
return (
    <div className="app-shell">
      <Toaster position="bottom-right" />
      <Navbar/>
      <main className="page-content">
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="/Edit/:id" element={<Edit />} />
          <Route path="/AllListings" element={<AllListings />} />
          <Route path="/NewListing" element={<NewListing />} />
          <Route path="/ShowListing/:id" element={<ShowListing />} />
          <Route path="/Regiter" element={<RegisterFormPage />} />
          <Route path="/Login" element={<LoginFormPage />} />
          <Route path="*" element={<div className="error-state"><h2>Page not found</h2><p>The page you’re looking for doesn’t exist.</p></div>} />
        </Routes>
      </main>
      <footer className="app-footer">A little progress, every day. <span>Wanderlist</span></footer>
    </div>
    )
    
}

export default AllListing;