import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function Login() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const checkToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true); 
    const response = await fetch('http://localhost:5000/checktoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Token is valid:', data);
      setTimeout(() => { 
        setLoading(false);
        navigate('/dashboardcourses');
      }, 1200);
    } else {
      setLoading(false); 
      console.error('Token is invalid or expired');
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading...</h2>
        <p>Please wait while we verify your information.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => { 
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target).entries());
    console.log(formData);

    try { 
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
         const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/dashboardcourses');
      } else {
        alert('password or username is incorrect');
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }
 

  return (
    <div className="">
      <h1> Institute of Many Things  </h1>
      <form className="login" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p>Welcome back! Please login to continue.</p>
        <input name="username" type="text" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <h3>
        Don’t have an account? <Link to="/">Sign Up</Link>
       
      </h3>
    </div>
  );
}
