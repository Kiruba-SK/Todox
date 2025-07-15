import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import addTaskAtom from "../../recoil/addTaskAtom";
import todoDataAtom from "../../recoil/todoDataAtom";
import filterDataAtom from "../../recoil/filterDataAtom";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import closeTaskAtom from "../../recoil/closeTaskAtom";
import AxiosInstance from "../../components/AxiosInstance";
import { toast } from "react-toastify";


const AddTask = () => {
  const [addTask, setAddTask] = useRecoilState(addTaskAtom);
  const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
  const [filterData, setFilterData] = useRecoilState(filterDataAtom);
  const [closeTask, setCloseTask] = useRecoilState(closeTaskAtom);

  const titleRef = useRef(null);
  const descRef = useRef(null);

  const addTaskHandler = async (e) => {
    e.preventDefault();

 const email = localStorage.getItem("email");
    if (!email) {
      toast.error("User not logged in!");
      return;
    }
    const newTask = {
      title: titleRef?.current?.value,
      desc: descRef?.current?.value,
      email: email,
    };
     

    try {
      const response = await AxiosInstance.post("/create_todo/", newTask);

      if (response.status === 201 || response.status === 200) {
        setAddTask(false);
        setTodoApiData(response.data?.todo_data);
        setFilterData(response.data?.stats);

        if (titleRef.current) titleRef.current.value = "";
        if (descRef.current) descRef.current.value = "";

        toast.success("Task added successfully!");
      } else {
        toast.error("Failed to add task. Please try again.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.info(error.response?.data?.error || "Something went wrong. Please try again.");
    }
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