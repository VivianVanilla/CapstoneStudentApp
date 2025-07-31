import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboardcourses() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [modalCourse, setModalCourse] = useState(null);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    coursename: '',
    shortdescription: '',
    longdescription: '', 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleNav = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 600); 
  };

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('http://localhost:5000/user', {
      headers: { 'Authorization': token }
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const admin = user?.admin;

  const fetchCourses = useCallback(async () => {
    const res = await fetch('http://localhost:5000/courses');
    if (res.ok) {
      const data = await res.json();
      setCourses(data);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSignUp = useCallback(async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token || !user?.userId || !courseId) return;
    const res = await fetch('http://localhost:5000/signedupcourses', {
      method: 'POST',
      headers: { 'Authorization': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.userId, courseId }),
    });
    if (res.ok) {
      await fetchUser(); 
    }
  }, [user, fetchUser]);

  const handleRemoveCourse = useCallback(async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token || !user?.userId || !courseId) return;
    const res = await fetch('http://localhost:5000/removecourses', {
      method: 'DELETE',
      headers: { 'Authorization': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.userId, courseId }),
    });
    if (res.ok) {
      await fetchUser(); 
    }
  }, [user, fetchUser]);

  const handleCreateCourse = useCallback(async (courseData) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('http://localhost:5000/createcourses', {
      method: 'POST',
      headers: { 'Authorization': token, 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    });
    if (res.ok) {
      await fetchCourses();
    }
  }, [fetchCourses]);

  const handleDeleteCourse = useCallback(async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('http://localhost:5000/deletecourses', {
      method: 'DELETE',
      headers: { 'Authorization': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    if (res.ok) {
      await fetchCourses();
    }
  }, [fetchCourses]);

  const handleCreateCourseSubmit = async (e) => {
    e.preventDefault();
    const courseData = {
      ...newCourse,
      courseid: Date.now().toString(),
      students: [],
    };
    await handleCreateCourse(courseData);
    setShowCreateModal(false);
    setNewCourse({ coursename: '', shortdescription: '' });
  };

  const studentCourses = user?.courses || [];


  const filteredCourses = courses.filter(course =>
    (course.coursename && course.coursename.toLowerCase().includes(search.toLowerCase())) ||
    (course.shortdescription && course.shortdescription.toLowerCase().includes(search.toLowerCase())) ||
    (course.longdescription && course.longdescription.toLowerCase().includes(search.toLowerCase()))
  );

  return (

    
    <div className="dashboard">
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
        <h2 className="highlight">
          <span  onClick={() => handleNav('/dashboardcourses')}>Courses</span>
        </h2>
        {admin === true && (
          <h2 >
            <span  onClick={() => handleNav('/dashboardstudentmanagement')}>Student Management</span>
          </h2>
        )}
      </div>

      <div>
        <div>
          <input
            type="text"
            placeholder="Search for courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />{' '}
          <button onClick={() => setSearch('')}>Clear</button>
          {admin === true && (
            <button onClick={() => setShowCreateModal(true)}>Create New Course</button>
          )}
        </div>

        <div className="dashboard-content">
          {filteredCourses.length === 0 && <div>No courses found.</div>}
          {filteredCourses.map(course => (
            <div className="course-bubble" key={course.coursename || course.shortdescription || course.longdescription || course.courseid}>
              <h4>{course.coursename}</h4>
              <p>{course.shortdescription}</p>
              <div className='course-buttons'>
                {studentCourses.map(String).includes(String(course.courseid)) ? (
                  <button onClick={() => handleRemoveCourse(course.courseid)}>Remove Course</button>
                ) : (
                  <button onClick={() => handleSignUp(course.courseid)}>Sign Up</button>
                )}
                <button onClick={() => setModalCourse(course)}>Learn more</button>
                {admin === true && <button onClick={() => handleDeleteCourse(course.courseid)}>Delete Course</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AVEEEE MARIAAAAAAAA  AAA */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'black',
              padding: '2rem',
              borderRadius: '8px',
              minWidth: '300px',
              maxWidth: '90%',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
            onSubmit={handleCreateCourseSubmit}
          >
            <button
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                fontSize: '1.2rem',
                border: 'none',
                background: 'white',
                cursor: 'pointer'
              }}
              type="button"
              onClick={() => setShowCreateModal(false)}
              aria-label="Close"
            >✖</button>
            <h2>Create New Course</h2>
            <label>
              Course Name:
              <input
                type="text"
                required
                value={newCourse.coursename}
                onChange={e => setNewCourse(c => ({ ...c, coursename: e.target.value }))}
              />
            </label>
            <label>
              Short Description:
              <input
                type="text"
                required
                value={newCourse.shortdescription}
                onChange={e => setNewCourse(c => ({ ...c, shortdescription: e.target.value }))}
              />
            </label>
            <label>
              Long Description:
              <textarea
                required
                value={newCourse.longdescription}
                onChange={e => setNewCourse(c => ({ ...c, longdescription: e.target.value }))}
              />
            </label>
            <button type="submit" style={{ marginTop: '1rem' }}>Create</button>
          </form>
        </div>
      )}

      {/* Modal TEHEHEH MODALL HAHAHA MODALL AHAHAHAHA  */}
      {modalCourse && (
        <div
          style={{
            display: 'flex',
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setModalCourse(null)}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'black',
              padding: '2rem',
              borderRadius: '8px',
              minWidth: '300px',
              maxWidth: '90%',
              maxHeight: '80%',
              overflowY: 'auto',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                fontSize: '1.2rem',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => setModalCourse(null)}
              aria-label="Close"
            >✖</button>
            <h3>{modalCourse.coursename}</h3>
            <p>{modalCourse.longdescription}</p>
          </div>
        </div>
      )}
    </div>
  );
}
