import { Link } from 'react-router-dom';
import satydice from '/assets/satydice.png';
import { useState } from 'react';

export default function Home({ message }) {

  
  const checkUnique = async (username, email, phone) => {
  const query = `username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
  const response = await fetch(`http://localhost:5000/unique?${query}`);
  const data = await response.json();
  return data.unique;
};

    
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());
    console.log(formData);

     const isUnique = await checkUnique(formData.username, formData.email, formData.phone || '');
     
  if (!isUnique) {
    alert('Username, email, or phone is already in use.');
    return; 
  }


    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      
      const result = await response.json();
      console.log('Server response:', result);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <div className="home">
      <div className="header ">
        <img src={satydice} className="logo" alt="Logo" />
        <h1>Welcome to Institute of Many Things ! </h1>
        <h3>Your gateway to learning and mastering DND Systems.</h3>
      </div>
       
       <div className="signup">
      <h2>Sign Up</h2>
      <form className='signup-form' onSubmit={handleSubmit}>
        <input required name="username" type="text" placeholder="Username" />
        <input required name="firstName" type="text" placeholder="First Name" />
        <input required name="lastName" type="text" placeholder="Last Name" />
        <input required name="email" type="email" placeholder="Email" />
        <input required name="password" type="password" placeholder="Password" />
        <span> Optional </span>
        <input name="address" type="text" placeholder="Address" />
        <input name="phone" type="text" placeholder="Phone" />
        <button type="submit" >Sign Up</button>
      </form>
      <h3>
        Already have an account? <Link to="/login">Login</Link>
      </h3>
    </div>

    

      
    </div>
  );
}
