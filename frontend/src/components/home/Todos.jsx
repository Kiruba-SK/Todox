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
import addTaskAtom from "../../recoil/addTaskAtom";
import AxiosInstance from "../../components/AxiosInstance";
import { toast } from "react-toastify";

const Todos = () => {
  const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
  const [activeFilter] = useRecoilState(activeFilterAtom);
  const [filterData, setFilterData] = useRecoilState(filterDataAtom);
  const [selectedEditTask, setSelectedEditTask] = useRecoilState(editTaskAtom);
  const [inputData] = useRecoilState(searchTextAtom);
  const [addTask, setAddTask] = useRecoilState(addTaskAtom);

  // Handlers for API actions
  const handleAction = async (url, method, bodyData) => {
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        toast.error("User not logged in!");
        return;
      }

      let response;
      if (method === "POST") {
        response = await AxiosInstance.post(`/${url}`, { ...bodyData, email });
      } else if (method === "DELETE") {
        response = await AxiosInstance.delete(`/${url}`, {
          data: { ...bodyData, email },
        });
      }

      if (response.status === 200) {
        setTodoApiData(response.data?.todo_data);
        setFilterData(response.data?.stats);
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      console.error(`${url} error:`, error);
      toast.error(error.response?.data?.error || "Something went wrong.");
    }
  };

  const filteredData = todoApiData?.filter((item) =>
    inputData === ""
      ? true
      : item?.title?.toLowerCase().includes(inputData?.toLowerCase())
  );

  return (
    <div className="todo-main-container">
      {filteredData?.length === 0 ? (
        activeFilter === "All" ? (
          <div className="empty-state-container">
            <h2>No Tasks Available</h2>
            <p>Looks like you haven't added any tasks yet.</p>
            <button
              onClick={() => setAddTask(true)}
              className="add-task-empty-btn"
            >
              + Add Task
            </button>
          </div>
        ) : (
          <div className="empty-state-container">
            <h2>No Tasks Available</h2>
            <p>Looks like no tasks found in this category.</p>
          </div>
        )
      ) : (
        filteredData?.map((data, index) => (
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
                    data?.status === "completed" ? "completed-todo-title" : ""
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
        ))
      )}
    </div>
  );
};

export default Todos;
