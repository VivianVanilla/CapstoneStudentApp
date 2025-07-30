import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


export default function Dashboardaccount() {
  const [user, setUser] = useState(null);
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

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
        setInputs({
          username: data.username || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          password: '', 
        });
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldChange = async (field) => {
   
    const token = localStorage.getItem('token');
    if (!token || !user) return;
    try {
    const response = await fetch('http://localhost:5000/userchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        username : user.username,
        field,
        value: inputs[field]
      })
    });

     const result = await response.json();
     console.log('Field updated:', result);
  } catch (error) {
    console.error('Error updating field:', error);
  }
 
  };
  
  // const handleFieldChange = async (field) => {
  //   const token = localStorage.getItem('token');
  //   if (!token || !user) return;
  //   const res = await fetch('http://localhost:5000/userchange', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': token
  //     },
  //     body: JSON.stringify({
  //       field,
  //       value: inputs[field]
  //     })
  //   });
  //   if (res.ok) {
  //     await res.json();
  //     alert('Update Recorded');
  //   } else {
  //     alert('Failed to update field.');
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const admin = user?.admin || false; 

  if (!user) return <div>Loading...</div>;


  return (
    <div className="dashboard"> 
    <div className="sidebar"> 
      <h2 className="highlight"><Link to="/dashboardaccount">Account</Link></h2>
      <h2  ><Link to="/dashboardcourses">Courses</Link></h2>
      {admin === true && <h2><Link to="/dashboardstudentmanagement">Student Management</Link></h2>}
      </div>
    
      <div className="dashboard-content">
         
        <div className="account-details">

          <div> <h4>Username:</h4> <input
              type="text"
              value={inputs.username}
              onChange={e => handleInputChange('username', e.target.value)}
            /> <button onClick={() => handleFieldChange('username')}>Change Username</button></div>
          <div> <h4>First Name:</h4> <input
              type="text"
              value={inputs.firstName}
              onChange={e => handleInputChange('firstName', e.target.value)}
            /> <button onClick={() => handleFieldChange('firstName')}>Change First Name</button></div>
          <div> <h4>Last Name:</h4> <input
              type="text"
              value={inputs.lastName}
              onChange={e => handleInputChange('lastName', e.target.value)}
            /> <button onClick={() => handleFieldChange('lastName')}>Change Last Name</button></div>
          <div> <h4>Phone:</h4> <input
              type="text"
              value={inputs.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
            /> <button onClick={() => handleFieldChange('phone')}>Change Phone</button></div>
        <div> <h4>Email:</h4> <input
              type="email"
              value={inputs.email}
              onChange={e => handleInputChange('email', e.target.value)}
            /> <button onClick={() => handleFieldChange('email')}>Change Email</button></div>
        <div> <h4>Password:</h4> <input
              type="password"
              value={inputs.password}
              onChange={e => handleInputChange('password', e.target.value)}
              placeholder="Enter new password"
            /> <button onClick={() => handleFieldChange('password')}>Change Password</button></div>
        <div> <h4>Billing Address:</h4> <input
              type="text"
              value={inputs.address}
              onChange={e => handleInputChange('address', e.target.value)}
            /> <button onClick={() => handleFieldChange('address')}>Change Address</button></div>
        <div> 
          <h4>Role:</h4> 

          {/*I am the god of this world. YOU WILL EMAIL ME IF YOU WANT TO BE AN ADMIN HAHAHAHAHAH*/}

          <h2>{user.role || 'Student'}</h2> 
         <a
              href="mailto:vivian.bonilla@outlook.com?subject=Request%20Admin%20Access&body=Hello%20Vivian,%0A%0AI%20would%20like%20to%20request%20admin%20access%20:P.%0A%0AThank%20you!"
              className="button"
              style={{ marginLeft: '1rem' }}
            >
              Request Admin
            </a>
        </div>
        <div> <h4>Logged in as: <span>{user.username}</span></h4> <button onClick={handleLogout}>Log Out</button></div>
        </div>
      </div>
    </div>
  );
}
