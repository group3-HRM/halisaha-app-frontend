import React, { useState} from "react";
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import "./searchField.css";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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
  isOccupied: false // Bu özellik daha sonra saatlerin dolu olup olmadığını belirlemek için kullanılabilir
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
      const response = await fetch(`http://localhost:4042/rent-football-field/rent-football-field-hours-filter?footballFieldId=${fieldId}`);
      if (response.ok) {
        const occupiedHours = await response.json();
        markOccupiedHours(occupiedHours, selectedDate); // Seçilen tarihi de gönderin
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const convertToLocaleTime = (dateString) => {
    const dateUTC = new Date(dateString);
    return new Date(dateUTC.getTime() + dateUTC.getTimezoneOffset() * 60000);
  };
 //////
 ////
 const markOccupiedHours = (occupiedHours, selectedDate) => {
  const updatedHours = initialHours.map(hour => {
    const hourRange = hour.label.split(" - ");
    const startHour = parseInt(hourRange[0], 10);

    const isOccupied = occupiedHours.some(occupiedHour => {
      const startDateLocal = convertToLocaleTime(occupiedHour.startDate);
      const endDateLocal = convertToLocaleTime(occupiedHour.endDate);

      return startDateLocal.getDate() === selectedDate.getDate() &&
             startDateLocal.getMonth() === selectedDate.getMonth() &&
             startDateLocal.getFullYear() === selectedDate.getFullYear() &&
             startDateLocal.getHours() === startHour;
    });

    return {
      ...hour,
      isOccupied: isOccupied
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
    const response = await fetch(`http://localhost:4042/rent-football-field/rent-football-field-hours-filter?footballFieldId=${fieldId}`);
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
    const [startHour, endHour] = selectedHour.split('-').map((time) => time.trim());
    
    const startDateUTC = new Date(Date.UTC(
      selectedDateTime.getUTCFullYear(),
      selectedDateTime.getUTCMonth(),
      selectedDateTime.getUTCDate(),
      parseInt(startHour, 10), 0, 0
    ));
  
    const endDateUTC = new Date(Date.UTC(
      selectedDateTime.getUTCFullYear(),
      selectedDateTime.getUTCMonth(),
      selectedDateTime.getUTCDate(),
      parseInt(endHour, 10), 0, 0
    ));
  
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
      if (!response.ok) {
        throw new Error("Something went wrong with the rent request.");
      }

      // İşlem başarılı
      const responseData = await response.json();
      console.log("Rent successful", responseData);
      // ... Başarı durumunda yapılacak işlemler
    } catch (error) {
      console.error("Rent failed", error);
      // ... Hata durumunda yapılacak işlemler
    }
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
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
      />
     <Select
      value={selectedHour}
      onChange={(e) => setSelectedHour(e.target.value)}
      displayEmpty
      inputProps={{ "aria-label": "Without label" }}
    >
        <MenuItem value="" disabled>
    Saat Aralığı Seçin
  </MenuItem>
  {hours.map((hour, index) => (
    <MenuItem 
      key={index} 
      value={hour.label} 
      style={{ color: hour.isOccupied ? 'red' : 'green' }} // Kırmızı veya yeşil renk ataması
      disabled={hour.isOccupied} // Dolu saat aralıklarını devre dışı bırak
    >
      {hour.label}
    </MenuItem>
  ))}
</Select>
      <button onClick={handleRent}>Kirala</button>
    </div>
  );
};

export default SearchPage;