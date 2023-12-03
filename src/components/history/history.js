import React, { useState, useEffect } from 'react';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions , Pagination} from '@mui/material';
import {jwtDecode} from 'jwt-decode';

const RentalHistoryPage = () => {
  const [rentals, setRentals] = useState([]);
  const [fieldDetails, setFieldDetails] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userid = decodedToken.id;

        const response = await fetch(`http://localhost:4042/rent-football-field/rent-football-field-history?userid=${userid}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRentals(data);
      } catch (error) {
        console.error("Rental history fetch error:", error);
      }
    };

    fetchRentals();
  }, []);

  const handleViewDetails = async (footballFieldid) => {
    try {
      // footballFieldid kullanarak detayları çek
      const response = await fetch(`http://localhost:4042/football-field/find-footballfield?id=${footballFieldid}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setFieldDetails(data); // Alınan detayları state'e kaydet
      setOpenDialog(true);    // Detayları göstermek için modalı aç
    } catch (error) {
      console.error("Football field details fetch error:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  const currentRentals = rentals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  return (
    <>
      {currentRentals.map((rental, index) => (
        <div key={index}>
          <p>Kiralama Tarihi: {new Date(rental.startDate).toLocaleString()}</p>
          <p>Bitiş Tarihi: {new Date(rental.endDate).toLocaleString()}</p>
          <Button onClick={() => handleViewDetails(rental.footballFieldid)}>
            Detayları Gör
          </Button>
        </div>
        
      ))}
          <Pagination
        count={Math.ceil(rentals.length / ITEMS_PER_PAGE)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Halı Saha Detayları</DialogTitle>
        <DialogContent>
          <Typography variant="h6">İsim: {fieldDetails?.name}</Typography>
          <Typography>Telefon: {fieldDetails?.telephoneNumber}</Typography>
          <Typography>Şehir: {fieldDetails?.city}</Typography>
          <Typography>İlçe: {fieldDetails?.district}</Typography>
          <Typography>Adres: {fieldDetails?.address}</Typography>
          <Typography>Fiyat: {fieldDetails?.price} TL</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RentalHistoryPage;
