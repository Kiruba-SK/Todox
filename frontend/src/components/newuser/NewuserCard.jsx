import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import newUserAtom from "../../recoil/newUserAtom";
import { useNavigate } from "react-router-dom";

const NewuserCard = () => {
  const [newUserTask, setNewUserTask] = useRecoilState(newUserAtom);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    const userCredentials = {
      username: usernameRef?.current?.value,
      password: passwordRef?.current?.value,
    };

    fetch("http://127.0.0.1:8000/create_user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data?.message === "User created successfully") {
          localStorage.setItem("userStatus", true);
          setNewUserTask(true);
          navigate("/"); // ✅ Navigate only after success
        } else {
          alert(data?.error || "Something went wrong");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong");
      });
  };

  return (
    <div className="save-card-container">
      <div>
        <h1 className="save-heading">New User</h1>
        <form onSubmit={onSubmit}>
          <table>
            <tbody>
              <tr>
                <td className="user-inputs">Name :</td>
                <td>
                  <input
                    className="save-inputs"
                    type="text"
                    placeholder="Username"
                    ref={usernameRef}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="user-inputs">Password :</td>
                <td>
                  <input
                    className="save-inputs"
                    type="password"
                    placeholder="Password"
                    ref={passwordRef}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button className="save-button" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewuserCard;

// import React, { useRef, useEffect, useState } from "react";
// import { useRecoilState } from "recoil";
// import newUserAtom from "../../recoil/newUserAtom";
// import { useNavigate } from "react-router-dom";

// const NewuserCard = () => {
//   // eslint-disable-next-line no-unused-vars
//   const [newUserTask, setNewUserTask] = useRecoilState(newUserAtom);
//   const [csrfToken, setCsrfToken] = useState("");

//   const usernameRef = useRef(null);
//   const passwordRef = useRef(null);

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

//   // functions
//   const navigate = useNavigate();

//   const onSubmit = (e) => {
//     e.preventDefault();

//     const userCredentials = {
//       username: usernameRef?.current?.value,
//       password: passwordRef?.current?.value,
//     };

//     fetch("http://127.0.0.1:8000/create_user/", {
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
//         if (data?.message === "User created") {
//           localStorage.setItem("userStatus", true);
//           setNewUserTask(true);
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
//       <div className="save-card-container">
//         <div>
//           <h1 className="save-heading">New User</h1>
//           <form onSubmit={onSubmit}>
//             <table>
//               <tbody>
//                 <tr>
//                   <td className="user-inputs">Name :</td>
//                   <td>
//                     <input
//                       className="save-inputs"
//                       type="text"
//                       placeholder="Username"
//                       ref={usernameRef}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="user-inputs">Password :</td>
//                   <td>
//                     <input
//                       className="save-inputs"
//                       type="password"
//                       placeholder="Password"
//                       ref={passwordRef}
//                     />
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//             <button
//               className="save-button"
//               type="submit"
//               onClick={() => {
//                 navigate("/");
//               }}
//             >
//               Save
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewuserCard;
