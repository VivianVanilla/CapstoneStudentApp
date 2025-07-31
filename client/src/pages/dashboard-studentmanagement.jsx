import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EditStudentModal from '../components/EditStudentModal';
import FilterModal from '../components/FilterModal';
import CreateStudentModal from '../components/CreateStudentModal';

export default function Dashboardstudentmanagement() {
  const admin = true;
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const API = process.env.REACT_APP_API_URL;

  // Loading handler for navigation
  const handleNav = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 600); 
  };

  // Filter logic (robust)
  const filteredStudents = students.filter(s => {
    const f = filter.trim().toLowerCase();
    if (!f) return true;
    return (
      (s.firstName || '').toLowerCase().includes(f) ||
      (s.lastName || '').toLowerCase().includes(f) ||
      (s.username || '').toLowerCase().includes(f)
    );
  });

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API}/students`, {
        headers: { 'Authorization': token }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    };
    const fetchCourses = async () => {
      const res = await fetch(`${API}/courses`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    };
    fetchStudents();
    fetchCourses();
  }, [API]);


  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setEditStudent({ ...student, password: '' }); 
  };


  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      let updatedCourses = editStudent.courses || [];
      if (checked) {
        updatedCourses = [...updatedCourses, value];
      } else {
        updatedCourses = updatedCourses.filter(cid => cid !== value);
      }
      setEditStudent({ ...editStudent, courses: updatedCourses });
    } else {
      setEditStudent({ ...editStudent, [name]: value });
    }
  };


  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fields = [
      'username',
      'firstName',
      'lastName',
      'email',
      'password',
      'address',
      'phone'
    ];

    for (const field of fields) {
      if (
        editStudent[field] !== selectedStudent[field] &&
        (field !== 'password' ? editStudent[field] : editStudent[field].length > 0)
      ) {
        await fetch(`${API}/adminuserchange`, {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: selectedStudent.username,
            field,
            value: editStudent[field]
          })
        });
      }
    }

    const origCourses = selectedStudent.courses || [];
    const newCourses = editStudent.courses || [];

    const addedCourses = newCourses.filter(cid => !origCourses.includes(cid));
    const removedCourses = origCourses.filter(cid => !newCourses.includes(cid));

    // Add student to new courses
    for (const courseid of addedCourses) {
      await fetch(`${API}/addstudenttocourse`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseid,
          username: selectedStudent.username
        })
      });
    }

    // Remove student from removed courses
    for (const courseid of removedCourses) {
      await fetch(`${API}/removestudentfromcourse`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseid,
          username: selectedStudent.username
        })
      });
    }

    setSelectedStudent(null);
    setEditStudent(null);

    // Refresh students
    const res = await fetch(`${API}/students`, {
      headers: { 'Authorization': token }
    });
    if (res.ok) {
      const data = await res.json();
      setStudents(data);
    }
  };

  // Create student fetch
  const handleCreateStudent = async (studentData) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    await fetch(`${API}/createstudent`, {
      method: 'POST',
      headers: { 'Authorization': token, 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    // Refresh students
    const res = await fetch(`${API}/students`, {
      headers: { 'Authorization': token }
    });
    if (res.ok) {
      const data = await res.json();
      setStudents(data);
    }
  };

  // --- UI ---
  return (
    <div className="dashboard">
      {/* Loading Screen */}
      {loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.7)', color: '#fff', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
        }}>
          Loading...
        </div>
      )}

      <div className="sidebar">
        <h2>
          <span  onClick={() => handleNav('/dashboardaccount')}>Account</span>
        </h2>
        <h2>
          <span  onClick={() => handleNav('/dashboardcourses')}>Courses</span>
        </h2>
        {admin === true && (
          <h2 className="highlight">
            <span  onClick={() => handleNav('/dashboardstudentmanagement')}>Student Management</span>
          </h2>
        )}
      </div>

      <div>
        <div className="dashboard-header">
          <button onClick={() => setShowCreateModal(true)}>Create a Student</button>
          <input
            type="text"
            placeholder="Filter students by name..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ marginLeft: 8, marginRight: 8 }}
          />
          <button onClick={() => setShowModal(true)}>Filter Search</button>
        </div>

        <FilterModal show={showModal} onClose={() => setShowModal(false)} />

        <div className="dashboard-content">
          {filteredStudents.map(student => (
            <div className="student-bubble" key={student.userId || student._id}>
              <h3>First Name: <span>{student.firstName}</span></h3>
              <h3>Last Name: <span>{student.lastName}</span></h3>
              <p>Email: <span>{student.email}</span></p>
              <button onClick={() => handleViewProfile(student)}>View Profile</button>
            </div>
          ))}
        </div>
      </div>

      <CreateStudentModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateStudent}
      />

      <EditStudentModal
        editStudent={editStudent}
        selectedStudent={selectedStudent}
        courses={courses}
        handleEditChange={handleEditChange}
        handleSave={handleSave}
        onClose={() => { setSelectedStudent(null); setEditStudent(null); }}
      />
    </div>
  );
}
