import React from 'react';
import { Link } from 'react-router-dom';

interface NavProps {
  role: string | null;
}

const Nav: React.FC<NavProps> = ({ role }) => {
    const Logout=()=> {
        localStorage.removeItem('token');
        localStorage.removeItem('userRoles');
        localStorage.removeItem('userData');
    }
  const navbarStyle = {
    background: 'green',
    color: '#fff',
    padding: '18px',
    outerHeight: '500px'
  
  };
  const listItemStyle = {
    display: 'inline-block',
    margin: '0 10px',
    cursor: 'pointer',
    listStyle: 'none',
  };

  const linkStyle = {
    textDecoration: 'none', 
    color: '#fff', 
  };

  return (
    <nav style={navbarStyle}>
      <ul>
        {role === 'Admin' && (
          <>
            <li style={listItemStyle}><Link to="/admin/products" style={linkStyle}>Products</Link></li>
            <li style={listItemStyle}><Link to="/admin/orders" style={linkStyle}>Orders</Link></li>
            <li style={listItemStyle}><Link to="/" style={linkStyle} onClick={Logout}>Log out</Link></li>
            <li style={{ float: 'right', listStyle: 'none' }}>Welcome {role}</li>
          </>
        )}
        {role === 'User' && (
          <>
            <li style={listItemStyle}><Link to="/user/products" style={linkStyle}>Products</Link></li>
            <li style={listItemStyle}><Link to="/user/mycart" style={linkStyle}>MyCart</Link></li>
            <li style={listItemStyle}><Link to="/" style={linkStyle}>Log out</Link></li>
            <li style={{ float: 'right', listStyle: 'none' }}>Welcome {role}</li>
          </>
        )}
      </ul>
    </nav>
  );
};
export default Nav;
