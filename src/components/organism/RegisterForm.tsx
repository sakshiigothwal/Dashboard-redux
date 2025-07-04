import { signInWithPopup } from 'firebase/auth';
import React, { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { auth, provider } from '../../firebase';
import { registerUser } from '../../redux/slice/authSlice';
import { RootState } from '../../redux/store';
import Button from '../atoms/Button';
import Form from '../molecules/Form';
import '../../styles/RegisterForm.css';

type RegisterProps = {
  email: string;
};

const RegisterForm = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.auth.users);

  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [success, setSuccess] = useState('');

  // handle input change and clear related error message
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: '' }));
  };

  // to validate
  const validate = () => {
    let isValid = true;
    const newError = { name: '', email: '', password: '', confirmPassword: '' };

    if (!data.name) {
      newError.name = 'Name is required';
      isValid = false;
    }

    if (!data.email) {
      newError.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newError.email = 'Invalid email';
      isValid = false;
    }

    if (!data.password) {
    newError.password = 'Password is required';
    isValid = false;
  } else {
    if (data.password.length < 8) {
      newError.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/[A-Z]/.test(data.password)) {
      newError.password = 'Must contain at least one uppercase letter';
      isValid = false;
    } else if (!/[a-z]/.test(data.password)) {
      newError.password = 'Must contain at least one lowercase letter';
      isValid = false;
    } else if (!/\d/.test(data.password)) {
      newError.password = 'Must contain at least one digit';
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
      newError.password = 'Must contain at least one special character';
      isValid = false;
    }
  }

    if (data.confirmPassword !== data.password) {
      newError.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  //handle google signIn
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userExists = users.some(
        (u: RegisterProps) => u.email.toLowerCase() === (user.email || '').toLowerCase(),
      );

      if (!userExists) {
        dispatch(
          registerUser({
            name: user.displayName || '',
            email: user.email || '',
            password: '',
          }),
        );
      }

      navigate('/login');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  // form based registration
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validate()) {
      //checks if user exists
      const userExists = users.some((user) => user.email === data.email);

      if (userExists) {
        setError((prev) => ({
          ...prev,
          email: 'Email is already registered',
        }));
        return;
      }

      //  a new user object is created and save to localStorage
      const newUser = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      dispatch(registerUser(newUser));
      setSuccess('Registered successful!');
      setTimeout(()=>navigate('/login'), 1500);
      setTimeout(() => setSuccess(''), 3000); 

    }
  };

  return (
    <div className="register">
      <div className="registerbox">
        <form onSubmit={handleSubmit}>
          <Form
            label="Name :"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={data.name}
            onChange={handleChange}
            onFocus={() => {}}
            error={error.name}
          />

          <Form
            label="Email :"
            name="email"
            type="email"
            placeholder="Enter email"
            value={data.email}
            onChange={handleChange}
            onFocus={() => {}}
            error={error.email}
          />

          <Form
            label="Password :"
            name="password"
            type="password"
            placeholder="Enter password"
            value={data.password}
            onChange={handleChange}
            onFocus={() => {}}
            error={error.password}
          />

          <Form
            label="Confirm Password :"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={data.confirmPassword}
            onChange={handleChange}
            onFocus={() => {}}
            error={error.confirmPassword}
          />

          <Button label="Register" type="submit" onClick={() => {}} />
        </form>

        <div className="or">or</div>
        {/* Sign in with google button */}
        <Button
          label="Continue with Google"
          type="button"
          onClick={handleGoogleSignIn}
        />
        {success && <p className="success">{success}</p>}
      </div>
    </div>
  );
};

export default RegisterForm;
