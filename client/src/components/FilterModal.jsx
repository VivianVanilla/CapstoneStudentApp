import React from 'react';

export default function FilterModal({ show, onClose }) {
  if (!show) return null;
  return (
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
      <button onClick={onClose}>Close</button>
    </div>
  );
}