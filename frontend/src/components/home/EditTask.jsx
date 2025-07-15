import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import todoDataAtom from "../../recoil/todoDataAtom";
import editTaskAtom from "../../recoil/editTaskAtom";
import filterDataAtom from "../../recoil/filterDataAtom";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import closeTaskAtom from "../../recoil/closeTaskAtom";
import AxiosInstance from "../../components/AxiosInstance";
import { toast } from "react-toastify";

const EditTask = () => {
  const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
  const [selectedEditTask, setSelectedEditTask] = useRecoilState(editTaskAtom);
  const [filterData, setFilterData] = useRecoilState(filterDataAtom);
  const [closeTask, setCloseTask] = useRecoilState(closeTaskAtom);

  const titleRef = useRef(null);
  const descRef = useRef(null);

  const editTaskHandler = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");
    if (!email) {
      toast.error("User not logged in!");
      return;
    }

    const updatedData = {
      id: selectedEditTask?.id,
      title: titleRef?.current?.value,
      desc: descRef?.current?.value,
      email: email,
    };
    try {
      const response = await AxiosInstance.put("/update_task/", updatedData);

      if (response.status === 201 || response.status === 200) {
        setSelectedEditTask(false);
        setTodoApiData(response.data?.todo_data);
        setFilterData(response.data?.stats);
        toast.success("Task updated successfully!");
      } else {
        toast.error("Failed to edit task. Please try again.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.info(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    }
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
