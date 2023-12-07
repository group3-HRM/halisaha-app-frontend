// Home.js dosyası
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../menu/sidebar'; // Sidebar'ın yolu
import SearchField from '../searchFootballField/searcField'; // SearchField bileşeninin yolu
import '../components.css'
import UpdateUserPage from '../update/update';
import ChangePasswordPage from '../UpdatePassword/updatePassword';
import FootballFieldForm from '../footballFieldAdd/footballFieldAdd';
import FootballFieldsPage from '../footballFieldList/footballFieldList';
import RentalHistoryPage from '../history/history';

const Home = () => {
    return (
      
      <div className="app-container">
      <div className="background-image-container"></div>
          <Sidebar />
          <div className="content">
          <main>

            <Routes>
              <Route path="search" element={<SearchField />} />
              <Route path="settings/user" element={<UpdateUserPage />} />
              <Route path="settings/password" element={<ChangePasswordPage/>}/>
              <Route path="fields/add" element={<FootballFieldForm/>}/>
              <Route path="fields/manage" element={<FootballFieldsPage/>}/>
              <Route path="history" element={<RentalHistoryPage/>}/>
      
            </Routes>
          </main>
        </div>
      </div>
    );
  };

export default Home;
