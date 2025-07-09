import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import addTaskAtom from "../recoil/addTaskAtom";
import todoDataAtom from "../recoil/todoDataAtom";
import apiDataAtom from "../recoil/apiDataAtom";
import editTaskAtom from "../recoil/editTaskAtom";
import filterDataAtom from "../recoil/filterDataAtom";
import closeTaskAtom from "../recoil/closeTaskAtom";
import AddTask from "../components/home/AddTask";
import EditTask from "../components/home/EditTask";
import Header from "../components/home/Header";
import Searchbar from "../components/home/Searchbar";
import Filters from "../components/home/Filters";
import Todos from "../components/home/Todos";
import "./Home.css";

const Home = () => {
  const [addTask, setAddTask] = useRecoilState(addTaskAtom);
  const [apiData, setApiData] = useRecoilState(apiDataAtom);
  const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
  const [filterData, setFilterData] = useRecoilState(filterDataAtom);
  const [closeTask, setCloseTask] = useRecoilState(closeTaskAtom);
  const [selectedEditTask, setSelectedEditTask] = useRecoilState(editTaskAtom);

  // ✅ Initial call to fetch todos and stats
  useEffect(() => {
    fetch("http://127.0.0.1:8000/initial_call/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setApiData(data);
        setTodoApiData(data?.todo_data);
        setFilterData(data?.stats);
      })
      .catch((error) => {
        alert("Error fetching initial data: " + error);
      });
  }, [setApiData, setTodoApiData, setFilterData]);

  return (
    <div className="relative">
      {addTask && (
        <>
          <div
            className="add-overlay"
            onClick={() => {
              setAddTask(false);
              setCloseTask(false);
            }}
          ></div>
          <AddTask />
        </>
      )}

      {selectedEditTask && (
        <>
          <div
            className="add-overlay"
            onClick={() => {
              setSelectedEditTask(false);
              setCloseTask(false);
            }}
          ></div>
          <EditTask />
        </>
      )}

      <div className="home-container">
        <Header />
        <Searchbar />
        <Filters />
        <Todos />
      </div>
    </div>
  );
};

export default Home;

// import React, { useEffect, useState } from "react";
// import addTaskAtom from "../recoil/addTaskAtom";
// import todoDataAtom from "../recoil/todoDataAtom";
// import AddTask from "../components/home/AddTask";
// import Header from "../components/home/Header";
// import Searchbar from "../components/home/Searchbar";
// import Filters from "../components/home/Filters";
// import Todos from "../components/home/Todos";
// import { useRecoilState } from "recoil";
// import "./Home.css";
// import apiDataAtom from "../recoil/apiDataAtom";
// import editTaskAtom from "../recoil/editTaskAtom";
// import EditTask from "../components/home/EditTask";
// import filterDataAtom from "../recoil/filterDataAtom";
// import closeTaskAtom from "../recoil/closeTaskAtom";

// const Home = () => {
//   const [addTask, setAddTask] = useRecoilState(addTaskAtom);
//   const [apiData, setApiData] = useRecoilState(apiDataAtom);
//   const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
//   const [filterData, setFilterData] = useRecoilState(filterDataAtom);
//   const [closeTask, setCloseTask] = useRecoilState(closeTaskAtom);
//   const [selectedEditTask, setSelectedEditTask] = useRecoilState(editTaskAtom);
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

//   // initial call to get apiData

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/intial_call/", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRFToken": csrfToken,
//       },
//       credentials: "include",
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         setApiData(data);
//         setTodoApiData(data?.todo_data);
//         setFilterData(data?.stats);
//       })
//       .catch((error) => {
//         alert(error);
//       });
//   }, [csrfToken, setApiData, setFilterData, setTodoApiData]);

//   return (
//     <div className="relative">
//       {addTask && (
//         <div>
//           <div
//             className="add-overlay "
//             onClick={() => {
//               setAddTask(false);
//               setCloseTask(false);
//             }}
//           ></div>
//           <AddTask />
//         </div>
//       )}
//       {selectedEditTask && (
//         <div>
//           <div
//             className="add-overlay"
//             onClick={() => {
//               setSelectedEditTask(false);
//               setCloseTask(false);
//             }}
//           ></div>
//           <EditTask />
//         </div>
//       )}

//       <div className="home-container">
//         <Header />
//         <Searchbar />
//         <Filters />
//         <Todos />
//       </div>
//     </div>
//   );
// };

// export default Home;
