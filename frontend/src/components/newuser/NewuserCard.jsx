import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import newUserAtom from "../../recoil/newUserAtom";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { toast } from "react-toastify";

const NewuserCard = () => {
  const [newUserTask, setNewUserTask] = useRecoilState(newUserAtom);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    const userCredentials = {
      name: nameRef?.current?.value,
      email: emailRef?.current?.value,
      password: passwordRef?.current?.value,
    };

    try {
      const response = await AxiosInstance.post(
        "/create_user/",
        userCredentials
      );

      if (response.status === 201 ) {
        localStorage.setItem("userStatus", true);
        localStorage.setItem("email", userCredentials.email);
        toast.success(response.data.message || "User created successfully!");
        setNewUserTask(true);
        navigate("/home");
      } else {
        toast.error(response.data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.info(error.response?.data?.error || "Something went wrong");
    }
  };

  const onClose = () => {
    navigate("/");
  };

  return (
    <div className="save-container">
      <div className="save-card-container">
        <h1 className="save-heading">Create Account</h1>
        <ClearRoundedIcon
          className="close-button"
          onClick={onClose}
          fontSize="small"
        />
        <form onSubmit={onSubmit}>
          <input
            className="save-inputs"
            type="text"
            placeholder="Name"
            ref={nameRef}
            required
          />

          <input
            className="save-inputs"
            type="email"
            placeholder="Email"
            ref={emailRef}
            required
          />

          <input
            className="save-inputs"
            type="password"
            placeholder="Password"
            ref={passwordRef}
            required
          />

          <button className="save-button" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewuserCard;
