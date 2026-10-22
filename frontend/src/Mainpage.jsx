import Navbar from "./navbar/Navbarpage.jsx"
import { Routes, Route,Navigate } from "react-router-dom";
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
    <>
    <div style={{color:"white"}}> 
      <Toaster position="bottom-right" />
      <hr />
      <Navbar/>
      <hr />
      <Routes> 
      <Route index element={<Homepage />} />
      <Route path="/Edit/:id" element={<Edit />} />
      <Route path="/AllListings" element={<AllListings />} />
      <Route path="/NewListing" element={<NewListing />} />
      <Route path="/ShowListing/:id" element={<ShowListing />} />
      <Route path="/Regiter" element={<RegisterFormPage />} />
      <Route path="/Login" element={<LoginFormPage />} />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      <br />
      <hr />
      <h1 >FOOTER</h1>
      <hr />
    </div>
    </>
    )
    
}

export default AllListing;