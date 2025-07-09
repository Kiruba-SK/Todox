import React, {useState} from "react";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userInfoAtom from "../../recoil/userInfoAtom";


const MyProfile = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
  });
  const email = localStorage.getItem("email");

  return (
  <div className="myprofile-container">
    <div>
        
      <button
        className="new-task-btn-2"
        onClick={() => {
          localStorage?.clear();
          setUserInfo(false);
          localStorage.setItem("userInfo", "false");
          navigate("/");
        }}
      >
        <LogoutRoundedIcon fontSize="medium" />
      </button>
    </div>
  </div>
  )
};


export default MyProfile;