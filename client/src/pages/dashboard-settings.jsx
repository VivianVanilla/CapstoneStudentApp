import { Link } from 'react-router-dom';


export default function Dashboardsettings() {
const admin = true; // This should be replaced with actual admin check logic


  return (
    <div className="dashboard"> 
    <div className="sidebar"> 
      <h2><Link to="/dashboardaccount">Account</Link></h2>
      <h2  ><Link to="/dashboardcourses">Courses</Link></h2>
      <h2 className="highlight"><Link to="/dashboardsettings">Settings</Link></h2>
      {admin === true && <h2><Link to="/dashboardstudentmanagement">Student Management</Link></h2>}
      </div>
    
      <div className="dashboard-content">
         Dashboard content goes here 
      </div>
      
      <Link to="/">Go back to Home</Link>
    </div>
  );
}
