import React from "react";
import myImage from "../images/logoExe.png";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import "../HomePage/HomePage.css";
import save from "../images/save.png";
import ship from "../images/ship.png";
import improve from "../images/improve.png";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="homepage container">
      <div className="homepage__header">
        <div>
          <img src={myImage} alt="" className="homepage__header__logo" />
        </div>
        <div className="homepage__login">
          <Link to="/login">
            <Button className="homepage__header_button" variant="outlined">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </div>
      <div className="homepage__info mt-3">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardMedia component="img" alt="green iguana" image={improve} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Cải thiện cuộc sống
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Giúp đỡ các chủ xe tải và tài xế xe tải kiếm được nhiều
                    doanh thu hơn, đảm bảo xe tải của họ luôn chạy trên làn
                    đường họ muốn.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardMedia component="img" alt="green iguana" image={ship} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Giảm chi phí gửi hàng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chúng tôi giúp tiết kiệm chi phí gửi hàng thông qua hệ thống
                    điều tiết, tìm kiếm xe vận chuyển có chất lượng dịch vụ và
                    khả năng hiển thị tốt hơn.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardMedia component="img" alt="green iguana" image={save} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Giảm lượng khí thải Carbon
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cùng nhau, chúng ta đang tạo ra một chuỗi cung ứng bền vững
                    và có trách nhiệm hơn với môi trường và hành tinh này.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
}
