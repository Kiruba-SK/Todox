import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import todoDataAtom from "../../recoil/todoDataAtom";
import editTaskAtom from "../../recoil/editTaskAtom";
import filterDataAtom from "../../recoil/filterDataAtom";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import closeTaskAtom from "../../recoil/closeTaskAtom";

const EditTask = () => {
  const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
  const [selectedEditTask, setSelectedEditTask] = useRecoilState(editTaskAtom);
  const [filterData, setFilterData] = useRecoilState(filterDataAtom);
  const [closeTask, setCloseTask] = useRecoilState(closeTaskAtom);

  const titleRef = useRef(null);
  const descRef = useRef(null);

  const editTaskHandler = (e) => {
    e.preventDefault();

    const updatedData = {
      id: selectedEditTask?.id,
      title: titleRef?.current?.value,
      desc: descRef?.current?.value,
    };

    fetch("http://127.0.0.1:8000/update_task/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        setSelectedEditTask(false);
        setTodoApiData(data?.todo_data);
        setFilterData(data?.stats);
      })
      .catch((error) => {
        console.error("Update Error:", error);
        alert("Failed to update task. Please try again.");
      });
  };

  return (
    <>
      {!closeTask && (
        <div className="add-task-container">
          <div className="add-task-contents">
            <div className="new-task-container">
              <h1>Edit Task</h1>
              <ClearRoundedIcon
                onClick={() => {
                  setSelectedEditTask(false);
                  setCloseTask(false);
                }}
              />
            </div>

            <form onSubmit={editTaskHandler} className="add-task-form">
              <input
                ref={titleRef}
                type="text"
                placeholder="Title"
                defaultValue={selectedEditTask?.title}
                required
              />
              <textarea
                ref={descRef}
                cols="30"
                rows="10"
                placeholder="Description"
                defaultValue={selectedEditTask?.desc}
                required
              ></textarea>
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditTask;


// import React, { useRef, useEffect, useState } from "react";
// import { useRecoilState } from "recoil";
// import todoDataAtom from "../../recoil/todoDataAtom";
// import editTaskAtom from "../../recoil/editTaskAtom";
// import filterDataAtom from "../../recoil/filterDataAtom";
// import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
// import closeTaskAtom from "../../recoil/closeTaskAtom";

// const EditTask = () => {
//   // Global variable
//   // const [addTask, setAddTask] = useRecoilState(addTaskAtom);
//   // eslint-disable-next-line no-unused-vars
//   const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
//   const [selectedEditTask, setSelectedEditTask] = useRecoilState(editTaskAtom);
//   // eslint-disable-next-line no-unused-vars
//   const [filterData, setFilterData] = useRecoilState(filterDataAtom);
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

//   const editTaskHandler = (e) => {
//     e.preventDefault();

//     const data = {
//       id: selectedEditTask?.id,
//       title: titleRef?.current?.value,
//       desc: descRef?.current?.value,
//     };

//     fetch("http://127.0.0.1:8000/update_task/", {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRFToken": csrfToken,
//       },
//       credentials: "include",
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         setSelectedEditTask(false);
//         setTodoApiData(data?.todo_data);
//         setFilterData(data?.stats);
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
//                   setSelectedEditTask(false);
//                   setCloseTask(false);
//                 }}
//               />
//             </div>

//             <form onSubmit={editTaskHandler} className="add-task-form">
//               <input
//                 ref={titleRef}
//                 type="text"
//                 placeholder="Title"
//                 defaultValue={selectedEditTask?.title}
//               />
//               <textarea
//                 ref={descRef}
//                 cols="30"
//                 rows="10"
//                 placeholder="Description"
//                 defaultValue={selectedEditTask?.desc}
//               ></textarea>
//               <button>Add</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default EditTask;
