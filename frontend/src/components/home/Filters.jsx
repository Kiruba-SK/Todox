import React from "react";
import { filterEndpoints } from "../../helper/filter";
import { useRecoilState } from "recoil";
import todoDataAtom from "../../recoil/todoDataAtom";
import activeFilterAtom from "../../recoil/activeFilterAtom";
import filterDataAtom from "../../recoil/filterDataAtom";
import AxiosInstance from "../../components/AxiosInstance";
import { toast } from "react-toastify";

const Filters = () => {
  const [todoApiData, setTodoApiData] = useRecoilState(todoDataAtom);
  const [activeFilter, setActiveFilter] = useRecoilState(activeFilterAtom);
  const [filterData, setFilterData] = useRecoilState(filterDataAtom);

  const handleFilterClick = async (label, endpoint) => {
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        toast.error("User email not found.");
        return;
      }

      const response = await AxiosInstance.post(`/${endpoint}`, { email });

      if (response.status === 200) {
        const data = response.data;
        if (!data.todo_data || !data.stats) {
          throw new Error("Invalid response format");
        }

        setTodoApiData(data.todo_data);
        setFilterData(data.stats);
        setActiveFilter(label);
      } else {
        toast.error("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error fetching filter data:", error);
      toast.info(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="filter-container">
      {Array.isArray(filterData) && filterData.length > 0 ? (
        filterData.map((data, index) => (
          <div key={index} className="filter-btn-container">
            <button
              onClick={() =>
                handleFilterClick(data.label, filterEndpoints[index]?.endpoint)
              }
              className={`filter-btn ${
                activeFilter === data.label ? "active-filter" : ""
              }`}
            >
              <h3>{data.label}</h3>
              <p
                className={`filter-count ${
                  activeFilter === data.label ? "active-filter-value" : ""
                }`}
              >
                {data.value}
              </p>
            </button>
          </div>
        ))
      ) : (
        <p>Loading filters...</p>
      )}
    </div>
  );
};

export default Filters;
