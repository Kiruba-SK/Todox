import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useNavigate } from "react-router-dom";
import addTaskAtom from "../../recoil/addTaskAtom";
import { useRecoilState } from "recoil";

const Header = (props) => {
  const [addTask, setAddTask] = useRecoilState(addTaskAtom);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(addTask);
  }, [addTask]);

  return (
    <header>
      <div className="home-header-container">
        <h1 className="header-logo-text">TodoX</h1>

        <div className="btn-container">
          <button
            className="new-task-btn"
            onClick={() => {
              if (addTask) {
                setAddTask(null);
              } else {
                setAddTask(true);
              }
            }}
          >
            <span>
              <AddIcon fontSize="large" />
            </span>
            New
          </button>
          
          <button className="profile-btn" onClick={() => navigate("/profile")}>
            <PersonRoundedIcon fontSize="large" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
