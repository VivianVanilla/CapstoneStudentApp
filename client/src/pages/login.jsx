import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="login">
      <h2>Login</h2>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <h3>
        Don’t have an account? <Link to="/">Sign Up</Link>
      </h3>
    </div>
  );
}
