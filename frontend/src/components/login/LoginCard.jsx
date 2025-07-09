import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import userInfoAtom from "../../recoil/userInfoAtom";
import { NavLink, useNavigate } from "react-router-dom";

const LoginCard = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    const userCredentials = {
      username: usernameRef?.current?.value,
      password: passwordRef?.current?.value,
    };

    fetch("http://127.0.0.1:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data?.message === "Successfully logged in") {
          localStorage.setItem("userStatus", true);
          setUserInfo(true);
          localStorage.setItem("userInfo", "true");
          navigate("/"); // redirect to home on success
        } else {
          localStorage.setItem("userStatus", false);
          alert(data?.message || "Login failed");
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);
        alert("Something went wrong during login.");
      });
  };

  return (
    <div className="login-card-container">
      <div>
        <h1 className="login-heading">TodoX</h1>
      </div>
      <form onSubmit={onSubmit}>
        <input
          className="login-inputs"
          type="text"
          placeholder="Username"
          ref={usernameRef}
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
      <h4 className="or-style">Or</h4>
      <div className="new-user">
        <NavLink to="/newuser">Create new user</NavLink>
      </div>
    </div>
  );
};

export default LoginCard;

// import React, { useRef, useEffect, useState } from "react";

// // recoil js
// import { useRecoilState } from "recoil";
// import userInfoAtom from "../../recoil/userInfoAtom";
// import { NavLink } from "react-router-dom";
// // import { Link } from "react-router-dom";

// const LoginCard = () => {
//   //global variables
//   // eslint-disable-next-line no-unused-vars
//   const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
//   // local variables
//   const usernameRef = useRef(null);
//   const passwordRef = useRef(null);
//   const [csrfToken, setCsrfToken] = useState("");

//   // Fetch CSRF Token from Django when component loads
//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/csrf/", {
//       method: "GET",
//       credentials: "include", // Ensures cookies are sent
//     })
//       .then((response) => response.json())
//       .then((data) => setCsrfToken(data.csrfToken)) // Save token to state
//       .catch((error) => console.error("CSRF Token Fetch Error:", error));
//   }, []);

//   // Login functions
//   const onSubmit = (e) => {
//     e.preventDefault();

//     const userCredentials = {
//       username: usernameRef?.current?.value,
//       password: passwordRef?.current?.value,
//     };

//     fetch("http://127.0.0.1:8000/login/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRFToken": csrfToken,
//       },
//       credentials: "include",
//       body: JSON.stringify(userCredentials),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         if (data?.message === "Successfully logined") {
//           localStorage.setItem("userStatus", true);
//           setUserInfo(true);
//         } else {
//           localStorage.setItem("userStatus", false);
//         }
//       })
//       .catch((error) => {
//         console.log("Error", error);
//       });
//   };

//   return (
//     <div>
//       <div className="login-card-container">
//         <div>
//           <h1 className="login-heading">TodoX</h1>
//         </div>
//         <form onSubmit={onSubmit}>
//           <input
//             className="login-inputs"
//             type="text"
//             placeholder="Username"
//             ref={usernameRef}
//           />
//           <input
//             className="login-inputs"
//             type="password"
//             placeholder="Password"
//             ref={passwordRef}
//           />

//           <button className="login-button" type="submit">
//             Login
//           </button>
//         </form>
//         <h4 className="or-style">Or</h4>
//         <div className="new-user">
//           <NavLink to="/newuser">Create new user</NavLink>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginCard;
