import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, CardMedia, Box } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import image from './indir.jpg';
const FootballFieldsPage = () => {
  const [footballFields, setFootballFields] = useState([]);

  useEffect(() => {
    const fetchFootballFields = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        try {
          const response = await axios.get('http://localhost:4042/football-field/get-footballfield', {
            params: { userid: decoded.id }
          });
          setFootballFields(response.data);
        } catch (error) {
          console.error('Halı saha bilgileri alınırken bir hata oluştu', error);
        }
      }
    };

    fetchFootballFields();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Halı Sahalarım
      </Typography>
      <Grid container spacing={3}>
        {footballFields.map((field) => (
          <Grid item xs={12} sm={6} md={4} key={field.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={image} // Buraya saha resmi URL'si
                alt={field.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {field.name}
                </Typography>
                <Box display="flex" alignItems="center">
                  <SportsSoccerIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {field.city}, {field.district}
                  </Typography>
                </Box>
                {/* Diğer bilgiler... */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FootballFieldsPage;