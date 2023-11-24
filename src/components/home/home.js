// Home.js dosyası
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../menu/sidebar'; // Sidebar'ın yolu
import SearchField from '../searchFootballField/searcField'; // SearchField bileşeninin yolu
import '../components.css'

const Home = () => {
    return (
      <div className="app-container home-background">
        <Sidebar /> {/* Sidebar bileşenini çağırıyoruz */}
        <div className="content">
          <main>
            {/* Ana sayfa içeriği */}
            {/* Dinamik olarak gösterilecek bileşenler için Route'ları burada tanımlayın */}
            <Routes>
              <Route path="search" element={<SearchField />} />
              {/* Home.js içindeki diğer içerikler veya bileşenler için Route'lar eklenebilir */}
            </Routes>
          </main>
        </div>
      </div>
    );
  };

export default Home;
