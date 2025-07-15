import React, { useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import userInfoAtom from "../../recoil/userInfoAtom";
import { NavLink, useNavigate } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";
import { toast } from "react-toastify";

const LoginCard = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const resetEmailRef = useRef(null);
  const newPasswordRef = useRef(null);

  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      email: emailRef?.current?.value,
      password: passwordRef?.current?.value,
    };

    try {
      const response = await AxiosInstance.post("/login/", credentials);

      if (response.status === 200 && response.data.success) {
        localStorage.setItem("userStatus", true);
        localStorage.setItem("email", credentials.email);
        toast.success(response.data.message || "Login successful!");
        setUserInfo(true);
        navigate("/home");
      } else {
        toast.error(response.data.error || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  const handleResetPassword = async () => {
    const email = resetEmailRef.current.value;
    const newPassword = newPasswordRef.current.value;

    try {
      const response = await AxiosInstance.post("/reset-password/", {
        email,
        new_password: newPassword,
      });

      if (response.status === 200) {
        toast.success("Password reset successful!");
        setShowReset(false);
      } else {
        toast.error(response.data.error || "Password reset failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error resetting password.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = showReset ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showReset]);

  return (
    <div className="login-container">
      <div className="login-card-container">
        <h1 className="login-heading">TodoX</h1>
        <form onSubmit={onSubmit}>
          <input
            className="login-inputs"
            type="email"
            placeholder="Email"
            ref={emailRef}
            required
          />
          <input
            className="login-inputs"
            type="password"
            placeholder="Password"
            ref={passwordRef}
            required
          />
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
        <div className="option-container">
          <div className="forgot-password" onClick={() => setShowReset(true)}>
            Forgot Password?
          </div>

          <div className="new-user">
            <NavLink className="login-link" to="/newuser">
              Create new user
            </NavLink>
          </div>
        </div>
      </div>

      {showReset && (
        <div className="reset-modal">
          <div className="reset-box">
            <h3>Reset Password</h3>
            <input
              className="login-inputs"
              type="email"
              placeholder="Enter your email"
              ref={resetEmailRef}
              required
            />
            <input
              className="login-inputs"
              type="password"
              placeholder="New password"
              ref={newPasswordRef}
              required
            />
            <div className="reset-buttons">
              <button className="reset-button" onClick={handleResetPassword}>
                Reset
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowReset(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginCard;
