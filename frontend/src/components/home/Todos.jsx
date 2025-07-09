import React from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useRecoilState } from "recoil";
import searchTextAtom from "../../recoil/searchTextAtom";
import todoDataAtom from "../../recoil/todoDataAtom";
import activeFilterAtom from "../../recoil/activeFilterAtom";
import editTaskAtom from "../../recoil/editTaskAtom";
import filterDataAtom from "../../recoil/filterDataAtom";

const Todos = () => {
  const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
  const [activeFilter] = useRecoilState(activeFilterAtom);
  const [filterData, setFilterData] = useRecoilState(filterDataAtom);
  const [selectedEditTask, setSelectedEditTask] = useRecoilState(editTaskAtom);
  const [inputData] = useRecoilState(searchTextAtom);

  // Handlers for API actions
  const handleAction = (url, method, bodyData) => {
    fetch(`http://127.0.0.1:8000/${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => response.json())
      .then((res) => {
        setTodoApiData(res?.todo_data);
        setFilterData(res?.stats);
      })
      .catch((error) => {
        console.log(`${url} error:`, error);
      });
  };

  return (
    <div className="todo-main-container">
      <div>
        {todoApiData
          ?.filter((item) =>
            inputData === ""
              ? true
              : item?.title?.toLowerCase().includes(inputData?.toLowerCase())
          )
          ?.map((data, index) => (
            <div key={index} className="todo-card">
              <div
                onClick={() =>
                  handleAction("complete_task/", "POST", { id: data?.id })
                }
                className={`${
                  data?.status === "completed" ? "checkbox-active" : "checkbox"
                }`}
              ></div>

              <div className="todo-content-container">
                <div className="todo-card-header">
                  <h2
                    className={`${
                      data?.status === "completed"
                        ? "completed-todo-title"
                        : ""
                    } todo-title`}
                  >
                    {data?.title}
                  </h2>

                  {activeFilter === "All" && (
                    <div className="icon-container">
                      <ArchiveOutlinedIcon
                        className="archieve"
                        onClick={() =>
                          handleAction("archive_task/", "POST", { id: data?.id })
                        }
                      />
                      <BorderColorOutlinedIcon
                        className="edit"
                        onClick={() =>
                          setSelectedEditTask({
                            id: data?.id,
                            title: data?.title,
                            desc: data?.desc,
                          })
                        }
                      />
                      <DeleteOutlineOutlinedIcon
                        className="delete"
                        onClick={() =>
                          handleAction("delete_task/", "DELETE", {
                            id: data?.id,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
                <p className="todo-desc">{data?.desc}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Todos;


// import React, { useEffect, useState } from "react";
// import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
// import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// // recoil
// import { useRecoilState } from "recoil";
// import searchTextAtom from "../../recoil/searchTextAtom";
// import todoDataAtom from "../../recoil/todoDataAtom";
// import activeFilterAtom from "../../recoil/activeFilterAtom";
// import editTaskAtom from "../../recoil/editTaskAtom";
// import filterDataAtom from "../../recoil/filterDataAtom";

// const Todos = () => {
//   // global variable
//   const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
//   /* eslint-disable no-unused-vars */
//   const [activeFilter, setActiveFilter] = useRecoilState(activeFilterAtom);
//   const [filterData, setFilterData] = useRecoilState(filterDataAtom);
//   /* eslint-disable no-unused-vars */
//   const [selectedEditTask,setSelectedEditTask] = useRecoilState(editTaskAtom);

//   // local variable
//   const [inputData] = useRecoilState(searchTextAtom);
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

//   return (
//     <div className="todo-main-container">
//       <div>
//         {todoApiData
//           ?.filter((filtered_data) => {
//             if (inputData === "") {
//               return true;
//             } 
//               return filtered_data?.title
//                 ?.toLowerCase()
//                 ?.includes(inputData?.toLowerCase())
            
//           })
//           ?.map((data, index) => {
//             return (
//               <div key={index} className="todo-card">
//                 <div>
//                   <div
//                     onClick={() => {
//                       const bodyData = {
//                         id: data?.id,
//                       };

//                       fetch("http://127.0.0.1:8000/complete_task/", {
//                         method: "POST",
//                         headers: {
//                           "Content-Type": "application/json",
//                           "X-CSRFToken": csrfToken,
//                         },
//                         credentials: "include",
//                         body: JSON.stringify(bodyData),
//                       })
//                         .then((response) => response.json())
//                         .then((res) => {
//                           console.log(res);
//                           setTodoApiData(res?.todo_data);
//                           setFilterData(res?.stats);
//                         })
//                         .catch((error) => {
//                           console.log("Error", error);
//                         });
//                     }}
//                     className={` ${
//                       data?.status === "completed"
//                         ? "checkbox-active"
//                         : "checkbox"
//                     } `}
//                   ></div>
//                 </div>
//                 <div className="todo-content-container">
//                   <div className="todo-card-header">
//                     <h2
//                       className={` ${
//                         data?.status === "completed"
//                           ? "completed-todo-title"
//                           : ""
//                       } todo-title`}
//                     >
//                       {data?.title}
//                     </h2>
//                     {activeFilter === "All" && (
//                       <div className="icon-container">
//                         <ArchiveOutlinedIcon
//                           className="archieve"
//                           onClick={() => {
//                             const bodyData = {
//                               id: data?.id,
//                             };
//                             fetch("http://127.0.0.1:8000/archieved_task/", {
//                               method: "POST",
//                               headers: {
//                                 "Content-Type": "application/json",
//                                 "X-CSRFToken": csrfToken,
//                               },
//                               credentials: "include",
//                               body: JSON.stringify(bodyData),
//                             })
//                               .then((response) => response.json())
//                               .then((res) => {
//                                 console.log(res);
//                                 // setAddTask(false);
//                                 setTodoApiData(res?.todo_data);
//                                 setFilterData(res?.stats);
//                               })
//                               .catch((error) => {
//                                 console.log("Error", error);
//                               });
//                           }}
//                         />
//                         <BorderColorOutlinedIcon
//                           className="edit"
//                           onClick={() => {
//                             setSelectedEditTask({
//                               id: data?.id,
//                               title: data?.title,
//                               desc: data?.desc,
//                             });
//                           }}
//                         />
//                         <DeleteOutlineOutlinedIcon
//                           className="delete"
//                           onClick={() => {
//                             const bodyData = {
//                               id: data?.id,
//                             };
//                             fetch("http://127.0.0.1:8000/delete_task/", {
//                               method: "DELETE",
//                               headers: {
//                                 "Content-Type": "application/json",
//                                 "X-CSRFToken": csrfToken,
//                               },
//                               credentials: "include",
//                               body: JSON.stringify(bodyData),
//                             })
//                               .then((response) => response.json())
//                               .then((res) => {
//                                 console.log(res);
//                                 // setAddTask(false);
//                                 setTodoApiData(res?.todo_data);
//                                 setFilterData(res?.stats);
//                               })
//                               .catch((error) => {
//                                 console.log("Error", error);
//                               });
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                   <p className="todo-desc">{data?.desc}</p>
//                 </div>
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// };

// export default Todos;
