import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboardstudentmanagement() {


  const admin = true; // Only an admin would be allowed in this page, so maybe this logic is okay lmao . WEll cause WHY DO I EVEN NEED USER DATA IN HERE  
   
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2><Link to="/dashboardaccount">Account</Link></h2>
        <h2 ><Link to="/dashboardcourses">Courses</Link></h2>
        {admin === true && <h2 className="highlight"><Link to="/dashboardstudentmanagement">Student Management</Link></h2>}
      </div>

      <div>
        <div className="dashboard-header">
          <button onClick={() => {}}>Create a Student</button>
          <input type="text" placeholder="Search for students..." />
          <button>Search</button>
          <button onClick={() => setShowModal(true)}>Filter Search</button>
          
        </div>

        {/* Modal MODAL MODAL AHHHHH*/}

        {showModal && (
          <div style={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#222',
            color: '#fff',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            zIndex: 1000
          }}>
            <h3>Filter Students</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                Sort By:
                <select>
                  <option value="firstname">first name</option>
                  <option value="lastname">last name</option>
                  <option value="email">email</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                Sort Alphabetically:
                <select>
                  <option value="descending">Descending</option>
                  <option value="ascending">Ascending</option>
                </select>
              </label>
            </div>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        )}

        <div className="dashboard-content">
          <div className="student-bubble">
            <h3>First Name: <span>Alice</span></h3>
            <h3>Last Name: <span>Smith</span></h3>
            <p>Email: <span>alice@email.com</span></p>
            <button>View Profile</button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
