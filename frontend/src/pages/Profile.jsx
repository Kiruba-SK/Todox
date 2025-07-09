import React from 'react'
import "./Profile.css";
import MyProfile from '../components/profile/MyProfile';

const Profile = () => {
  return (
    <div>
      <div className='profile-container'>
       <MyProfile /> 
      </div>
    </div>
  )
}

export default Profile;