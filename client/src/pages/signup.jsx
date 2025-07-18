import { Link } from 'react-router-dom';
import satydice from '../../public/assets/satydice.png';

export default function Home({ message }) {
  return (
    <div>
      <div className="header">
        <img src={satydice} className="logo" alt="Logo" />
        <h1>Welcome! Sign up to learn DND Systems!</h1>
      </div>
       
       <div className="signup">
      <h2>Sign Up</h2>
      <form className='signup-form'>
        <input required type="text" placeholder="Username" />
        <input required type="text" placeholder="First Name" />
        <input required type="text" placeholder="Last Name" />
        <input required type="email" placeholder="Email" />
        <input required type="password" placeholder="Password" />
        <span> Optional </span>
        <input type="text" placeholder="Address" />
        <input type="text" placeholder="Phone" />
        <button type="tel">Sign Up</button>
      </form>
      <h3>
        Already have an account? <Link to="/login">Login</Link>
      </h3>
    </div>

    

      <h2>{message || 'Loading message from backend...'}</h2>
    </div>
  );
}
