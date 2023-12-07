import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Token'ı localStorage'dan al
    const token = localStorage.getItem('token');
    

    const checkTokenValidity = async () => {
      try {
        // API çağrısını yap
        const response = await fetch('http://localhost:4040/auth/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Eğer cevap başarılı değilse, ya da token geçerli değilse
        // kullanıcıyı login sayfasına yönlendir
        if (!response.ok) {
          throw new Error('Token is invalid');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    if (token) {
      checkTokenValidity();
    } else {
      // Eğer token yoksa kullanıcıyı giriş sayfasına yönlendir
      navigate('/login');
    }
  }, [navigate]);


  return <>{children}</>;
};

export default ProtectedRoute;
