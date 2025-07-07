import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // Buat file CSS untuk styling

// Komponen navigasi yang berubah tergantung status login
const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Marketplace</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/sell">Beli Barang</Link>
            <Link to="/report">Laporan</Link>
            <Link to="/my-products">Produk Saya</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;