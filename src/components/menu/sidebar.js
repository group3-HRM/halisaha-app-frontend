import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './sidebar.css';

const Sidebar = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setEmail(decoded.email);
      setRole(decoded.role);
    }
  }, []);

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <div className="sidebar">
<div className="sidebar-header">
        <img src="/profile-image.jpg" alt="Profile" className="sidebar-profile-image" />
        <h3>{email}</h3>
        <p>{role}</p>
      </div>
      <nav className="sidebar-nav">
        <Link to="/home/search" className="sidebar-nav-item">SAHA ARA</Link>
        <Link to="/home/history" className="sidebar-nav-item">GEÇMİŞ</Link>
        <div className="sidebar-nav-item" onClick={toggleSettings}>AYARLAR {settingsOpen ? <ExpandLessIcon className="expand-icon" /> : <ExpandMoreIcon className="expand-icon" />}</div>
        {settingsOpen && (
          <div className="sidebar-settings">
            <Link to="/home/settings/user" className="sidebar-settings-item">Kullanıcı Bilgileri</Link>
            <Link to="/home/settings/password" className="sidebar-settings-item">Parola Değiştir</Link>
            <Link to="/home/settings/authority" className="sidebar-settings-item">Halısaha Yetkisi Al</Link>
          </div>
        )}
       <Link to="/login" className="sidebar-logout">ÇIKIŞ YAP</Link>
      </nav>
    </div>
  );
};

export default Sidebar;