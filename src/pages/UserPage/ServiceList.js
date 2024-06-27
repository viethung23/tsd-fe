import React from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

export default function ServiceList() {
  const serviceData = [
    {
      vehicleType: "Xe máy",
      distanceRates: [
        { distance: "3km đầu:", rate: "15,000 đ" },
        { distance: "Km tiếp theo:", rate: "5,000 đ" },
      ],
    },
    {
      vehicleType: "Xe Ba gác*",
      distanceRates: [
        { distance: "2km đầu:", rate: "110,000 đ" },
        { distance: "2km - 10km:", rate: "15,000 đ" },
        { distance: "10km - 15km:", rate: "10,000 đ" },
        { distance: ">= 15km:", rate: "9,000 đ" },
      ],
    },
    {
      vehicleType: "Xe Bán tải*",
      distanceRates: [
        { distance: "2km đầu:", rate: "110,000 đ" },
        { distance: "2km - 10km:", rate: "15,000 đ" },
        { distance: "10km - 15km:", rate: "10,000 đ" },
        { distance: ">= 15km:", rate: "9,000 đ" },
      ],
    },
    {
      vehicleType: "Xe Van 500Kg*",
      distanceRates: [
        { distance: "2km đầu:", rate: "110,000 đ" },
        { distance: "2km - 10km:", rate: "15,000 đ" },
        { distance: "10km - 15km:", rate: "10,000 đ" },
        { distance: ">= 15km:", rate: "9,000 đ" },
      ],
    },
    {
      vehicleType: "Xe Tải 500Kg*",
      distanceRates: [
        { distance: "2km đầu:", rate: "110,000 đ" },
        { distance: "2km - 10km:", rate: "15,000 đ" },
        { distance: "10km - 15km:", rate: "10,000 đ" },
        { distance: ">= 15km:", rate: "9,000 đ" },
      ],
    },
    {
      vehicleType: "Xe tải 1000kg*",
      distanceRates: [
        { distance: "2km đầu:", rate: "140,000 đ" },
        { distance: "2km - 10km:", rate: "17,000 đ" },
        { distance: "10km - 15km:", rate: "10,000 đ" },
        { distance: ">= 15km:", rate: "8,000 đ" },
      ],
    },
    // Các loại xe khác sẽ được thêm vào đây
  ];

  return (
    <>
      <UserHeader title="Bảng giá dịch vụ" />
      <Table style={{ marginBottom: "90px" }}>
        <TableHead style={{ borderTop: "1px solid #F37022" }}>
          <TableRow>
            <TableCell align="center" className="fw-bold">
              Loại xe
            </TableCell>
            <TableCell align="center" className="fw-bold">
              Quãng đường
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {serviceData.map((service, index) => (
            <TableRow key={index}>
              <TableCell align="center">{service.vehicleType}</TableCell>
              <TableCell align="center">
                <ul style={{ listStyle: "none" }}>
                  {service.distanceRates.map((rate, i) => (
                    <li key={i}>
                      {rate.distance} {rate.rate}
                    </li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UserFooter />
    </>
  );
}
