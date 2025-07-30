import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function Dashboardcourses() {

const [user, setUser] = useState(null);

useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('http://localhost:5000/user', {
      headers: { 'Authorization': token }
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    }
  };
  fetchUser();
}, []);

const admin = user?.admin 

  return (
    <div className="dashboard"> 
    <div className="sidebar"> 
      <h2><Link to="/dashboardaccount">Account</Link></h2>
      <h2 className="highlight" ><Link to="/dashboardcourses">Courses</Link></h2>
     
      {admin === true && <h2><Link to="/dashboardstudentmanagement">Student Management</Link></h2>}
      </div>

      <div>
        <div> <input type="text" placeholder="Search for courses..." /> <button>Search</button> {admin === true && <button>Create New Course</button>} </div>
        
      <div className="dashboard-content">

     

  <div className="course-bubble"> <h4> Course 4 </h4> <p> Course 4  description goes here </p> <div className='course-buttons'> {admin === false && <button>Request seat</button>} <button>Learn more</button> {admin === true && <button>Delete Course</button>} </div> </div>

      </div>

    </div>

    </div>
    
  );
}
