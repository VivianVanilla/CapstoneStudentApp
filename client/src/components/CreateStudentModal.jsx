import React, { useState } from 'react';

export default function CreateStudentModal({ show, onClose, onCreate }) {
  const [inputs, setInputs] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    phone: ''
  });

  if (!show) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await onCreate(inputs);
    setInputs({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      address: '',
      phone: ''
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}
      onClick={onClose}
    >
      <form
        style={{
          background: '#23272f', color: '#fff', padding: '2rem',
          borderRadius: '1.2rem', minWidth: '350px', maxWidth: '95vw',
          width: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem'
        }}
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <button
          style={{
            position: 'absolute', top: 14, right: 18, fontSize: '1.3rem',
            border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 'bold'
          }}
          type="button"
          onClick={onClose}
          aria-label="Close"
        >✖</button>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Student</h2>
        {['username', 'firstName', 'lastName', 'email', 'password', 'address', 'phone'].map(field => (
          <label key={field} style={{ fontWeight: 500 }}>
            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
            <input
              name={field}
              type={field === 'password' ? 'password' : 'text'}
              value={inputs[field]}
              onChange={handleChange}
              style={{
                width: '100%', padding: '0.5rem', borderRadius: '0.4rem',
                border: '1px solid #444', marginTop: '0.2rem',
                background: '#181b20', color: '#fff'
              }}
              required
            />
          </label>
        ))}
        <button type="submit" style={{
          marginTop: '1rem', padding: '0.7rem 0', borderRadius: '0.5rem',
          border: 'none', background: 'linear-gradient(90deg, #4f8cff 0%, #2355a0 100%)',
          color: '#fff', fontWeight: 600, fontSize: '1.1rem', letterSpacing: '1px', cursor: 'pointer'
        }}>
          Create
        </button>
      </form>
    </div>
  );
}