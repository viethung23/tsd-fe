import { Autocomplete, Grid, TextField } from "@mui/material";
import React, { useState } from "react";

export default function AutoComplete() {
  const [pickupAddress, setPickupAddress] = useState(null);
  const [pickupOptions, setPickupOptions] = useState([]);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const handlePickupChange = (event, newValue) => {
    setPickupAddress(newValue);
    if (newValue) {
      // Gọi hàm để lấy kinh độ và vĩ độ cho pickup
      getGeocode(newValue.id).then((coordinates) => {
        setPickupCoordinates(coordinates);
      });
    } else {
      setPickupCoordinates(null);
    }
  };
  const loadOptions = async (inputValue, setAddressState, setOptionsState) => {
    try {
      // Gọi API GET để lấy danh sách địa chỉ gợi ý dựa trên inputValue
      const response = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?input=${inputValue}&api_key=oLlIcCqn7OC5JAj9MaEthx4oKtQJvyIZXYrxyiCN`
      );
      const data = await response.json();

      // Kiểm tra xem có dữ liệu gợi ý không
      if (data?.predictions) {
        const formattedOptions = data.predictions.map((prediction) => ({
          label: prediction.description,
          id: prediction.place_id,
        }));
        setOptionsState(formattedOptions);
      } else {
        setOptionsState([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getGeocode = async (placeId) => {
    try {
      // Gọi API geocoding để lấy kinh độ và vĩ độ dựa trên place_id
      const response = await fetch(
        `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=oLlIcCqn7OC5JAj9MaEthx4oKtQJvyIZXYrxyiCN`
      );
      const data = await response.json();

      // Kiểm tra xem có dữ liệu geocoding không
      if (data?.result?.geometry?.location) {
        const { lat, lng } = data.result.geometry.location;
        return { lat, lng };
      }
    } catch (error) {
      console.error("Error fetching geocode:", error);
    }
    return null;
  };
  console.log(pickupCoordinates);
  return (
    <>
      <Autocomplete
        value={pickupAddress}
        onChange={handlePickupChange}
        options={pickupOptions}
        getOptionLabel={(option) => option.label}
        onInputChange={(event, newInputValue) =>
          loadOptions(newInputValue, setPickupAddress, setPickupOptions)
        }
        renderInput={(params) => (
          <Grid sx={{ mb: 1 }} container spacing={2}>
            <Grid item xs={10}>
              {" "}
              <TextField
                {...params}
                placeholder="Lấy hàng tại đâu?"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#F37022",
                    },
                    "&:hover fieldset": {
                      borderColor: "#F37022",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#F37022",
                    },
                  },
                  "& label.Mui-focused": {
                    color: "#F37022", // Màu label khi trỏ vào ô input
                  },
                }}
              />
            </Grid>
          </Grid>
        )}
      />
    </>
  );
}
