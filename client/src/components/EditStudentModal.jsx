import React from 'react';

export default function EditStudentModal({
  editStudent,
  selectedStudent,
  courses,
  handleEditChange,
  handleSave,
  onClose
}) {
  if (!selectedStudent || !editStudent) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000
      }}
      onClick={onClose}
    >
      <form
        style={{
          background: '#23272f',
          color: '#fff',
          padding: '2.5rem 2rem 2rem 2rem',
          borderRadius: '1.2rem',
          minWidth: '350px',
          maxWidth: '95vw',
          width: '400px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem'
        }}
        onClick={e => e.stopPropagation()}
        onSubmit={e => { e.preventDefault(); handleSave(); }}
      >
        <button
          style={{
            position: 'absolute',
            top: 14,
            right: 18,
            fontSize: '1.3rem',
            border: 'none',
            background: 'transparent',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          type="button"
          onClick={onClose}
          aria-label="Close"
        >✖</button>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', letterSpacing: '1px' }}>Edit Student</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {['username', 'firstName', 'lastName', 'email', 'password', 'address', 'phone'].map(field => (
            <label key={field} style={{ fontWeight: 500 }}>
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
              <input
                name={field}
                type={field === 'password' ? 'password' : 'text'}
                value={editStudent[field] || ''}
                onChange={handleEditChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.4rem',
                  border: '1px solid #444',
                  marginTop: '0.2rem',
                  background: '#181b20',
                  color: '#fff'
                }}
              />
            </label>
          ))}
          <div>
            <h4>Courses:</h4>
            {courses.map(course => (
              <label key={course.courseid} style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  value={course.courseid}
                  checked={editStudent.courses && editStudent.courses.includes(course.courseid)}
                  onChange={handleEditChange}
                />
                {course.coursename}
              </label>
            ))}
          </div>
          <button type="submit" style={{ marginTop: '1rem' }}>Save</button>
        </div>
      </form>
    </div>
  );
}