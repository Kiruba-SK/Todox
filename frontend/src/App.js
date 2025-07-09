import { Routes, Route, Navigate } from "react-router-dom";
// components
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewUser from "./pages/NewUser";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/newuser" element={<NewUser />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
