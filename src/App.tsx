import React from 'react';
import logo from './logo.svg';
import './App.css';
import Cart from './Components/Cart';
import { Greet } from './Greeting';
import { Link, Route, Routes } from "react-router-dom";
import Login from './Components/Login';
import Admin from './Components/Admin';
import User from './Components/User';
import axios from 'axios';
import Orders from './Components/Orders';
import Register from './Components/Register';
function App() {
  const token=localStorage.getItem('token');
  axios.defaults.headers.common = {
    'Authorization': 'Bearer ' + token
};
  return (

    <Routes>
   
          {/* <Route path="/books">
            <Route path=":id" element={<Book/>}/>
          </Route> */}
    <Route path="/" element={<Login />} />
    <Route path="/admin-dashboard" element={<Admin/>} />
    <Route path="/user-dashboard" element={<Register/>} />
    <Route path="/admin/orders" element={<Orders/>} />
    <Route path="/admin/products" element={<Admin/>} />
    <Route path="/user/products" element={<User/>} />
    <Route path="/user/mycart" element={<Cart/>} />
    
  </Routes>

  );

}
export default App;
