import { Link } from 'react-router-dom';


export default function Dashboardcourses() {
const admin = true; // This should be replaced with actual admin check logic
const selectedCourse = null; 

  return (
    <div className="dashboard"> 
    <div className="sidebar"> 
      <h2><Link to="/dashboardaccount">Account</Link></h2>
      <h2 className="highlight" ><Link to="/dashboardcourses">Courses</Link></h2>
     
      {admin === true && <h2><Link to="/dashboardstudentmanagement">Student Management</Link></h2>}
      </div>

      <div>
        <div> <input type="text" placeholder="Search for courses..." /> <button>Search</button> </div>

      <div className="dashboard-content">

     

  <div className="course-bubble"> <h4> Course 4 </h4> <p> Course 4  description goes here </p> <div className='course-buttons'> <button>Request seat</button> <button>Learn more</button> </div> </div>
           
      </div>

    </div>

    </div>
    
  );
}
