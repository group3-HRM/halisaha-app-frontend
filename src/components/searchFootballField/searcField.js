import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import "./searchField.css";

import { Grid, Button, Paper, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { jwtDecode } from "jwt-decode";
//
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

// const hours = Array.from({ length: 24 }, (_, index) => ({
//   label: `${index}:00 - ${index + 1}:00`,
//   value: index,
// }));
//
const initialHours = Array.from({ length: 24 }, (_, index) => ({
  label: `${index}:00 - ${index + 1}:00`,
  value: index,
  isOccupied: false, // Bu özellik daha sonra saatlerin dolu olup olmadığını belirlemek için kullanılabilir
}));
//

const SearchPage = () => {
  const columns = [
    {
      field: "id",
      headerName: "Seç",
      sortable: false,
      width: 90,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <button onClick={() => handleSelectField(params.value)}>Seç</button>
      ),
    },
    {
      field: "name",
      headerName: "Adı",
      width: 130,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <div
            style={{
              whiteSpace: "normal",
              lineHeight: "normal", // Satır yüksekliğini ayarlayarak metnin okunaklılığını artırabilirsiniz
              maxHeight: "100%", // Hücrenin maksimum yüksekliği, gerekirse bu değeri artırabilirsiniz
              overflow: "auto", // Gerekirse içeriğin kaydırılabilir olmasını sağlar
            }}
          >
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "telephoneNumber",
      headerName: "Telefon Numarası",
      width: 130,
      flex: 0,
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: "Adres",
      width: 200,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <div
            style={{
              whiteSpace: "normal",
              lineHeight: "normal", // Satır yüksekliğini ayarlayarak metnin okunaklılığını artırabilirsiniz
              maxHeight: "100%", // Hücrenin maksimum yüksekliği, gerekirse bu değeri artırabilirsiniz
              overflow: "auto", // Gerekirse içeriğin kaydırılabilir olmasını sağlar
            }}
          >
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    {
      field: "price",
      headerName: "Fiyat",
      type: "number",
      width: 90,
      flex: 0,
      headerAlign: "right",
    },
  ];
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [rows, setRows] = useState([]);

  const [selectedFootballFieldId, setSelectedFootballFieldId] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date()); // Tarih için yeni state
  ///

  const [hours, setHours] = useState(initialHours);
  //
  const [selectedHour, setSelectedHour] = useState(hours[0].label);
  const [activeHourIndex, setActiveHourIndex] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar'ın açık olup olmadığını kontrol eder
  const [openDialog, setOpenDialog] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleHourClick = (index) => {
    if (!hours[index].isOccupied) {
      setSelectedHour(hours[index].label);
      setActiveHourIndex(index); // Seçili olan saat diliminin index'ini state'e kaydet
    }
  };
  const renderTimeSlots = () => (
    <Grid container spacing={2}>
      {hours.map((hour, index) => (
        <Grid item xs={3} sm={2} md={1} key={index}>
          <Paper
            elevation={hour.isOccupied ? 0 : 3} // Dolu ise gölge yok, boş ise gölge var
            style={{
              whiteSpace: "nowrap", // Metni tek satırda tutar
              overflow: "hidden", // Fazla metin varsa gizler
              textOverflow: "ellipsis", // Fazla metin için üç nokta ekler
              padding: "10px",
              borderRadius: "10px", // Kenarları yuvarlak
              backgroundColor: hour.isOccupied ? "#f44336" : "#e0e0e0", // Kırmızı veya gri arka plan
              color: hour.isOccupied ? "white" : "black", // Yazı rengi
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "35%", // Yükseklik doldur
              cursor: hour.isOccupied ? "not-allowed" : "pointer", // İmleç stilini ayarla
              border: index === activeHourIndex ? "2px solid green" : "none", // Eğer saat dilimi seçiliyse yeşil çerçeve olacak
            }}
            onClick={() => handleHourClick(index)}
          >
            <Typography variant="body2" style={{ fontSize: "0.75rem" }}>
              {hour.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
  const handleSearch = async () => {
    const queryParams = new URLSearchParams({ city, district }).toString();
    try {
      const response = await fetch(
        `http://localhost:4042/football-field/football-field-city-district?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const jsonData = await response.json();
        // Map the data to include a sequential id starting at 1
        const transformedData = jsonData.map((item, index) => ({
          id: index + 1, // Start id at 1 and increment
          ...item,
        }));
        setRows(transformedData);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSelectField = async (fieldId) => {
    setSelectedFootballFieldId(fieldId);
    try {
      const response = await fetch(
        `http://localhost:4042/rent-football-field/rent-football-field-hours-filter?footballFieldId=${fieldId}`
      );
      if (response.ok) {
        const occupiedHours = await response.json();
        markOccupiedHours(occupiedHours, selectedDate); // Seçilen tarihi de gönderin
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    handleOpenDialog();
  };
  const convertToLocaleTime = (dateString) => {
    const dateUTC = new Date(dateString);
    return new Date(dateUTC.getTime() + dateUTC.getTimezoneOffset() * 60000);
  };
  //////
  ////
  const markOccupiedHours = (occupiedHours, selectedDate) => {
    const updatedHours = initialHours.map((hour) => {
      const hourRange = hour.label.split(" - ");
      const startHour = parseInt(hourRange[0], 10);

      const isOccupied = occupiedHours.some((occupiedHour) => {
        const startDateLocal = convertToLocaleTime(occupiedHour.startDate);
        // const endDateLocal = convertToLocaleTime(occupiedHour.endDate);

        return (
          startDateLocal.getDate() === selectedDate.getDate() &&
          startDateLocal.getMonth() === selectedDate.getMonth() &&
          startDateLocal.getFullYear() === selectedDate.getFullYear() &&
          startDateLocal.getHours() === startHour
        );
      });

      return {
        ...hour,
        isOccupied: isOccupied,
      };
    });

    setHours(updatedHours);
  };
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    // Yeni tarih için dolu saat aralıklarını tekrar kontrol edin
    // Önceki seçilen futbol sahası ID'si ve yeni tarih ile
    if (selectedFootballFieldId) {
      fetchAndMarkOccupiedHours(selectedFootballFieldId, newDate); // Bu fonksiyon API çağrısı ve markOccupiedHours fonksiyonunu içermeli
    }
  };
  const fetchAndMarkOccupiedHours = async (fieldId, date) => {
    try {
      const response = await fetch(
        `http://localhost:4042/rent-football-field/rent-football-field-hours-filter?footballFieldId=${fieldId}`
      );
      if (response.ok) {
        const occupiedHours = await response.json();
        markOccupiedHours(occupiedHours, date); // Dolu saatleri işaretleme fonksiyonunu çağır
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  ///
  const handleRent = async () => {
    if (!selectedFootballFieldId) {
      alert(
        "No football field selected. Please select a field before renting."
      );
      return;
    }
    if (!selectedHour) {
      alert("Lütfen geçerli bir saat aralığı seçin.");
      return;
    }
    if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
      alert("Lütfen geçerli bir tarih seçin.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated");
      alert("Lütfen önce giriş yapın.");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userid = decodedToken.id;
    const selectedDateTime = new Date(selectedDate);
    const [startHour, endHour] = selectedHour
      .split("-")
      .map((time) => time.trim());

    const startDateUTC = new Date(
      Date.UTC(
        selectedDateTime.getUTCFullYear(),
        selectedDateTime.getUTCMonth(),
        selectedDateTime.getUTCDate(),
        parseInt(startHour, 10),
        0,
        0
      )
    );

    const endDateUTC = new Date(
      Date.UTC(
        selectedDateTime.getUTCFullYear(),
        selectedDateTime.getUTCMonth(),
        selectedDateTime.getUTCDate(),
        parseInt(endHour, 10),
        0,
        0
      )
    );

    const rentRequestPayload = {
      footballFieldid: selectedFootballFieldId,
      userid: userid,
      startDate: startDateUTC.toISOString(),
      endDate: endDateUTC.toISOString(),
      time: 4,
    };
    try {
      const response = await fetch(
        "http://localhost:4042/rent-football-field/rent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(rentRequestPayload),
        }
      );
      if (response.ok) {
        // İşlem başarılı olduğunda
        const responseData = await response.json();
        console.log("Rent successful", responseData);

        // Diyalogu ve başarı snackbar'ını kapat
        setOpenDialog(false);
        setOpenSnackbar(true);

        // İsteğe bağlı: Başarı mesajını göstermek için bir zaman aşımı ayarlayabilirsiniz
        setTimeout(() => {
          setOpenSnackbar(false);
        }, 6000); // 6 saniye sonra snackbar'ı kapat

        // ... Diğer başarı durumunda yapılacak işlemler
      } else {
        // İşlem başarısız olduğunda
        throw new Error("Something went wrong with the rent request.");
      }
    } catch (error) {
      // Hata oluştuğunda
      console.error("Rent failed", error);
      setShowErrorSnackbar(true);

      // İsteğe bağlı: Hata mesajını göstermek için bir zaman aşımı ayarlayabilirsiniz
      setTimeout(() => {
        setShowErrorSnackbar(false);
      }, 6000); // 6 saniye sonra hata snackbar'ını kapat
    }
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false); // Snackbar'ı kapat
  };
  return (
    <div className="search-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Şehir"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="İlçe"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />
        <button onClick={handleSearch}>Ara</button>
      </div>
      <div style={{ width: 600, height: 500 }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
      {/* Saat aralığı seçimi için dropdown */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth={true} // Dialogun tam genişlik kullanmasını sağlar
        maxWidth="lg"
        className="dialog-custom"
        sx={{ height: "auto", maxHeight: "80vh" }}
      >
        {/* // Dialogun maksimum genişliğini belirtir (xs, sm, md, lg, xl) */}
        <DialogTitle>Saha Kiralama</DialogTitle>
        <DialogContent style={{ height: '22vh', overflowY: "unset" }}>
          <div style={{ marginBottom: "20px" }}>
            {" "}
            {/* Tarih seçimine alttan boşluk ekler */}
            <DatePicker selected={selectedDate} onChange={handleDateChange} />
          </div>
          {renderTimeSlots()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRent} color="primary" startIcon={<ShoppingCartIcon/>}>
            Kirala
          </Button>
          <Button onClick={handleCloseDialog} color="secondary">
            İptal
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Burada konumu ayarlayabilirsiniz
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{
            width: "100%",
            backgroundColor: "green", // Arka plan rengini değiştir
            color: "white", // Yazı rengini değiştir
            boxShadow: 6, // Gölge ekle
          }}
        >
          İşlem başarılı! Saha başarıyla kiralandı.
        </Alert>
      </Snackbar>
      {/* Hata ıcın snackbar */}
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowErrorSnackbar(false)}
      >
        <Alert
          onClose={() => setShowErrorSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Hata! Kiralama işlemi başarısız oldu.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SearchPage;
