import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'; // react-router-dom kullanarak SPA yapısını koruyabilirsiniz
import { jwtDecode } from 'jwt-decode'; 
import './sidebar.css'; // Sidebar için özel bir CSS dosyası

const Sidebar = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token'); // Token'ı localStorage'dan al
    if (token) {
      const decoded = jwtDecode(token); // Token'ı decode et
      setEmail(decoded.email); // Kullanıcı adını state'e kaydet (Payload içindeki name alanı)
      setRole(decoded.role);
    }
  }, []);
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/profile-image.jpg" alt="Profile" className="sidebar-profile-image" />
        <h3>{email}</h3>
        <p>{role}</p>
      </div>
      <input type="search" placeholder="SEARCH..." className="sidebar-search" />
      <nav className="sidebar-nav">
      <Link to="/home/search" className="sidebar-nav-item">SAHA ARA</Link>
        <Link to="/hospital" className="sidebar-nav-item">GECMIS</Link>
        <Link to="/analytics" className="sidebar-nav-item">ANALYTICS</Link>
        <Link to="/settings" className="sidebar-nav-item">SETTINGS</Link>
        <button className="sidebar-logout">ÇIKIŞ YAP</button>
      </nav>
    </div>
  );
};

export default Sidebar;
