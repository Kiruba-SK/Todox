import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import addTaskAtom from "../../recoil/addTaskAtom";
import todoDataAtom from "../../recoil/todoDataAtom";
import filterDataAtom from "../../recoil/filterDataAtom";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import closeTaskAtom from "../../recoil/closeTaskAtom";

const AddTask = () => {
  const [addTask, setAddTask] = useRecoilState(addTaskAtom);
  const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
  const [filterData, setFilterData] = useRecoilState(filterDataAtom);
  const [closeTask, setCloseTask] = useRecoilState(closeTaskAtom);

  const titleRef = useRef(null);
  const descRef = useRef(null);

  const addTaskHandler = (e) => {
    e.preventDefault();

    const newTask = {
      title: titleRef?.current?.value,
      desc: descRef?.current?.value,
    };

    fetch("http://127.0.0.1:8000/create_todo/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        setAddTask(false);
        setTodoApiData(data?.todo_data);
        setFilterData(data?.stats);

        if (titleRef.current) titleRef.current.value = "";
        if (descRef.current) descRef.current.value = "";
      })
      .catch((error) => {
        console.error("Error creating task:", error);
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <>
      {!closeTask && (
        <div className="add-task-container">
          <div className="add-task-contents">
            <div className="new-task-container">
              <h1>New Task</h1>
              <ClearRoundedIcon
                onClick={() => {
                  setAddTask(false);
                  setCloseTask(false);
                }}
              />
            </div>

            <form onSubmit={addTaskHandler} className="add-task-form">
              <input
                ref={titleRef}
                type="text"
                placeholder="Title"
                required
              />
              <textarea
                ref={descRef}
                cols="30"
                rows="10"
                placeholder="Description"
                required
              ></textarea>
              <button type="submit">Add</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTask;


// import React, { useRef, useEffect, useState } from "react";
// import { useRecoilState } from "recoil";
// import addTaskAtom from "../../recoil/addTaskAtom";
// import todoDataAtom from "../../recoil/todoDataAtom";
// import filterDataAtom from "../../recoil/filterDataAtom";
// import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
// import closeTaskAtom from "../../recoil/closeTaskAtom";

// const AddTask = () => {
//   // Global variable
//   /* eslint-disable no-unused-vars */
//   const [addTask, setAddTask] = useRecoilState(addTaskAtom);
//   const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
//   const [filterData, setFilterData] = useRecoilState(filterDataAtom);
//   /* eslint-enable no-unused-vars */
//   const [closeTask, setCloseTask] = useRecoilState(closeTaskAtom);
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

//   // local variable
//   const titleRef = useRef(null);
//   const descRef = useRef(null);

//   const addTaskHandler = (e) => {
//     e.preventDefault();

//     const data = {
//       // id: addTask?.id,
//       title: titleRef?.current?.value,
//       desc: descRef?.current?.value,
//     };

//     fetch("http://127.0.0.1:8000/create_todo/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRFToken": csrfToken,
//       },
//       credentials: "include",
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("API Response:", data);
//         setAddTask(false);
//         setTodoApiData(data?.todo_data);
//         setFilterData(data?.stats);

//         if (titleRef.current) titleRef.current.value = "";
//         if (descRef.current) descRef.current.value = "";
//       })
//       .catch((error) => {
//         console.log("Error", error);
//       });
//   };
//   return (
//     <>
//       {!closeTask && (
//         <div className="add-task-container">
//           <div className="add-task-contents">
//             <div className="new-task-container">
//               <h1>New Task</h1>
//               <ClearRoundedIcon
//                 onClick={() => {
//                   setAddTask(false);
//                   setCloseTask(false);
//                 }}
//               />
//             </div>

//             <form onSubmit={addTaskHandler} className="add-task-form">
//               <input ref={titleRef} type="text" placeholder="Title" />
//               <textarea
//                 ref={descRef}
//                 cols="30"
//                 rows="10"
//                 placeholder="Description"
//               ></textarea>
//               <button type="submit">Add</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AddTask;
