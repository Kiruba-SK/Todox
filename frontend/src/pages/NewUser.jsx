import React from 'react';
import "./NewUser.css";
import NewuserCard from '../components/newuser/NewuserCard';

const NewUser = () => {
  return (
    <div>
        <div className='save-container'>
           <NewuserCard />
        </div>
    </div>
  )
}

export default NewUser;