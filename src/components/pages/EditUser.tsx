import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


import Sidebar from '../molecules/Sidebar';

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, name, email } = location.state;

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

  useEffect(() => {
    if (nameRef.current) nameRef.current.value = name;
    if (emailRef.current) emailRef.current.value = email;
  }, [name, email]);

  const handleUpdate = async () => {
    const updatedName = nameRef.current?.value;
    const updatedEmail = emailRef.current?.value;

    if (updatedName && updatedEmail) {
      try {
        await axios.put(`https://685b7af589952852c2d9ab22.mockapi.io/api/users/${id}`, {
          name: updatedName,
          email: updatedEmail
        });
        setMessage('User updated successfully!');
        setTimeout(()=>navigate('/users'), 1000);
      } catch (error) {
        console.error('Error updating user:', error);
        setError('error in updating user');
        setMessage('');
      }
    }
  };

  return (
    <div>
      <Sidebar />
      <h2>Edit User</h2>
      <input ref={nameRef} placeholder="Name" />
      <input ref={emailRef} placeholder="Email" />
      <button onClick={handleUpdate}>Update</button>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default EditUser;
