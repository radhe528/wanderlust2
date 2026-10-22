import { Routes, Route } from "react-router-dom";
import Mainpage from "./Mainpage.jsx"
import "./app.css"

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Mainpage />} />
    </Routes>
  );
}

export default App;
