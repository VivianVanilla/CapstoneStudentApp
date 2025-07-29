import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboardstudentmanagement() {
  const admin = true; // This should be replaced with actual admin check logic
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2><Link to="/dashboardaccount">Account</Link></h2>
        <h2 className="highlight"><Link to="/dashboardcourses">Courses</Link></h2>
        {admin === true && <h2><Link to="/dashboardstudentmanagement">Student Management</Link></h2>}
      </div>

      <div>
        <div>
          <input type="text" placeholder="Search for students..." />
          <button>Search</button>
          <button onClick={() => setShowModal(true)}>Filter modal</button>
        </div>

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
          <div className="course-bubble">
            <h4>Alice</h4>
            <h4>Smith</h4>
            <p>alice@email.com</p>
     
            <div className="course-buttons">
              <button>Registered Courses</button>
              <button>Edit Details</button>
            </div>
          </div>
          <div className="course-bubble">
            <h4>Bob</h4>
            <h4>Johnson</h4>
            <p>bob@email.com</p>
        
            <div className="course-buttons">
              <button>Registered Courses</button>
              <button>Edit Details</button>
            </div>
          </div>
          <div className="course-bubble">
            <h4>Charlie</h4>
            <h4>Williams</h4>
            <p>charlie@email.com</p>
         
            <div className="course-buttons">
              <button>Registered Courses</button>
              <button>Edit Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
