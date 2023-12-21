import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { Link } from 'react-router-dom';

interface DecodedToken {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata": string;
  exp: number;
  iss: string;
  aud: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      Email: '',
      Password: '',
    },
    validationSchema: Yup.object({
      Email: Yup.string().email('Invalid email address').required('Required'),
      Password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => { 
      try {
        const response = await axios.post('https://localhost:7008/api/Account/Login', {
          Email: values.Email,
          Password: values.Password,
        });

        if (response.status === 200) {
          const token = response.data;
          const decodedToken = jwtDecode(token) as DecodedToken;
          const userRoles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          const userData = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"];
          localStorage.setItem('token', token);
          localStorage.setItem('userRoles', userRoles);
          localStorage.setItem('userData', userData);
          let role;
          if (userRoles === 'Admin') {
            role = 'admin';
          } else if (userRoles === 'User') {
            role = 'user';
          } else {
            role = 'null';
          }
          if (role === 'admin') {
            navigate('/admin/products');
          } else if (role === 'user') {
            navigate('/user/products');
          } else {
            navigate('/default-route');
          }
        } else {
         
        }
      } catch (error) {
        // Handle error
      }
    },
  });

  return (
    <div className="login-container">
      <Link to="/user-dashboard">Register</Link>
      <h1>Login</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>
            Email:
            <input
              type="text"
              name="Email"
              value={formik.values.Email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </label>
          {formik.touched.Email && formik.errors.Email && (
            <div className="error-message">{formik.errors.Email}</div>
          )}
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              name="Password"
              value={formik.values.Password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </label>
          {formik.touched.Password && formik.errors.Password && (
            <div className="error-message">{formik.errors.Password}</div>
          )}
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
