import { Link } from 'react-router-dom';


export default function Dashboardaccount() {
const admin = true; // This should be replaced with actual admin check logic


  return (
    <div className="dashboard"> 
    <div className="sidebar"> 
      <h2 className="highlight"><Link to="/dashboardaccount">Account</Link></h2>
      <h2  ><Link to="/dashboardcourses">Courses</Link></h2>
      {admin === true && <h2><Link to="/dashboardstudentmanagement">Student Management</Link></h2>}
      </div>
    
      <div className="dashboard-content">
         
        <div className="account-details">

          <div> <h4>Username:</h4> <input type="text" defaultValue="JohnDoe" /> <button>Change Username</button></div>
          <div> <h4>First Name:</h4> <input type="text" defaultValue="John" /> <button>Change First Name</button></div>
          <div> <h4>Last Name:</h4> <input type="text" defaultValue="Doe" /> <button>Change Last Name</button></div>
          <div> <h4>Phone:</h4> <input type="text" defaultValue="(123) 456-7890" /> <button>Change Phone</button></div>
        <div> <h4>Email:</h4> <input type="email" defaultValue="johndoe@example.com" /> <button>Change Email</button></div>
        <div> <h4>Password:</h4> <input type="password" defaultValue="********" /> <button>Change Password</button></div>
        <div> <h4>Billing Address:</h4> <input type="text" defaultValue="********" /> <button>Change  Address</button></div>
        <div> <h4>Role:</h4> <h2>Student</h2> <button>Request Admin</button></div>
        </div>
      </div>
    </div>
  );
}
