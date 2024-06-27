import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import "../HomePage/HomePage.css";
import UserHeader from "../UserPage/UserHeader";
import UserFooter from "../UserPage/UserFooter";
import banner from "../images/slide.png";
import banner2 from "../images/slide2.png";
import banner3 from "../images/slide3.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LightModeIcon from "@mui/icons-material/LightMode";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Link } from "react-router-dom";

export default function UserPage() {
  const [currentBanner, setCurrentBanner] = useState(banner);
  const banners = [banner, banner2, banner3];
  const bannerInterval = 5000;

  const changeBanner = () => {
    const currentIndex = banners.indexOf(currentBanner);
    const nextIndex = (currentIndex + 1) % banners.length;
    setCurrentBanner(banners[nextIndex]);
  };

  useEffect(() => {
    const timer = setInterval(changeBanner, bannerInterval);
    return () => {
      clearInterval(timer);
    };
  }, [currentBanner]);
  return (
    <>
      <UserHeader />

      <div className="mb-5 userpage container">
        <CardMedia
          className="mb-3 banner"
          component="img"
          alt="Banner"
          image={currentBanner}
          title="Banner"
        />
        <Grid container spacing={3} className="mb-5">
          <Grid item xs={6} sm={3}>
            <Link to="/service" style={{ textDecoration: "none" }}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <SummarizeIcon sx={{ color: "#F37022" }} fontSize="large" />
                  </Box>
                  <Typography variant="subtitle1" align="center">
                    Bảng giá
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <LightModeIcon sx={{ color: "#F37022" }} fontSize="large" />
                </Box>
                <Typography variant="subtitle1" align="center">
                  Giải pháp
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <DeveloperBoardIcon
                    sx={{ color: "#F37022" }}
                    fontSize="large"
                  />
                </Box>
                <Typography variant="subtitle1" align="center">
                  Công nghệ
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <HelpOutlineIcon sx={{ color: "#F37022" }} fontSize="large" />
                </Box>
                <Typography variant="subtitle1" align="center">
                  Liên hệ
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <UserFooter />
    </>
  );
}
