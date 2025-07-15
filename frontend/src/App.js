import { Routes, Route, Navigate } from "react-router-dom";
import { RecoilRoot } from "recoil";
// components
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewUser from "./pages/NewUser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <RecoilRoot>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
        theme="light"
        className="toast-container"
        toastClassName="toast-container-custom"
        bodyClassName="toast-body-custom"
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/newuser" element={<NewUser />} />
      </Routes>
    </RecoilRoot>
  );
}

export default App;
