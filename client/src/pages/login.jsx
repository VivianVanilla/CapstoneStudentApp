import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="">
      <h1> Institute of Many Things  </h1>
      <form className="login">
        <h1>Login</h1>
        <p>Welcome back! Please login to continue.</p>
        <input type="text" placeholder="Email/Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
         <Link to="/dashboardcourses"> Fake Login</Link>

      </form>
      <h3>
        Don’t have an account? <Link to="/">Sign Up</Link>
       
      </h3>
    </div>
  );
}
