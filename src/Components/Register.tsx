import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: 'string',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:7008/api/Account/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('Registration successful');
        
        navigate('/');
      } else {
        console.error('Registration failed');
        const errorData = await response.json(); 
        console.error('Error details:', errorData);
      
      }
    } catch (error: any) {
      console.error('Error during registration:', error.message);
    }
  };

  return (
    <div>
      <h1>Check your inbox to verify the email</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
