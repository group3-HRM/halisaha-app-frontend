import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginPage from './components/login/login';
import RegisterPage from './components/register/register';

import ProtectedRoute from './components/protectedRoute/protectedRoute';
import Home from './components/home/home';



function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/home/*' element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
            }/>
          {/* '/home/*' path'i Home içinde tanımlanan child route'lar için wildcard olarak kullanılır */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
