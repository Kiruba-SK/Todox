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
import AxiosInstance from "../components/AxiosInstance";
import "./Home.css";
import { toast } from "react-toastify";

const Home = () => {
  const [addTask, setAddTask] = useRecoilState(addTaskAtom);
  const [apiData, setApiData] = useRecoilState(apiDataAtom);
  const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
  const [filterData, setFilterData] = useRecoilState(filterDataAtom);
  const [closeTask, setCloseTask] = useRecoilState(closeTaskAtom);
  const [selectedEditTask, setSelectedEditTask] = useRecoilState(editTaskAtom);

  // Initial call to fetch todos and stats
    useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      toast.info("User email not found. Please log in again.");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get(`/initial_call/`, {
          params: { email }, 
        });

        setApiData(response.data);
        setTodoApiData(response.data?.todo_data);
        setFilterData(response.data?.stats);
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Error fetching initial data");
      }
    };

    fetchData();
  }, []);

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
