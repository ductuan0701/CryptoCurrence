import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChartSimple,
faComment,
} from "@fortawesome/free-solid-svg-icons";

// Đăng ký các thành phần cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);


// import { faChartSimple } from "@fortawesome/free-regular-svg-icons";

const ThongKe = () => {
  const [data, setData] = useState({
    commentsStats: { day: 0, week: 0, month: 0 },
    publicArticlesStats: { day: 0, week: 0, month: 0 },
    rejectedArticlesStats: { day: 0, week: 0, month: 0 },
    likesPerMonth: Array(12).fill(0),
    viewsPerMonth: Array(12).fill(0),
    followersPerMonth: Array(12).fill(0),
  });

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Call API
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage (hoặc sessionStorage)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/others/statistics/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Gửi token
          },
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch statistics");
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  // Cấu hình dữ liệu cho biểu đồ bài viết theo tháng
  const articleChartData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Lượt Thích",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.8)",
        hoverBorderColor: "rgba(75, 192, 192, 1)",
        data: data.likesPerMonth,
      },
    ],
  };

  // Cấu hình dữ liệu cho biểu đồ bình luận theo tháng
  const commentChartData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Lượt Xem",
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 99, 132, 0.8)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
        data: data.viewsPerMonth,
      },
    ],
  };

  // Cấu hình dữ liệu cho biểu đồ đăng ký theo tháng
  const usersRegisteredPerMonth = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Lượt Theo Dõi",
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 99, 132, 0.8)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
        data: data.followersPerMonth,
      },
    ],
  };

  return (
    <div className="content-wrapper" style={{ minHeight: "1203.31px"}}>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>{data.commentsStats.day} Bình Luận</h3>
                  <p>Đã Nhận Hôm Nay</p>
                </div>
                <div className="icon">
                    <FontAwesomeIcon  icon={faComment} />
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{data.publicArticlesStats.day} Bài Viết</h3>
                  <p>Được Duyệt Hôm Nay</p>
                </div>
                <div className="icon">
                    <FontAwesomeIcon  icon={faChartSimple} />
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{data.rejectedArticlesStats.day} Bài Viết </h3>
                  <p>Bị Từ Chối Hôm Nay</p>
                </div>
                <div className="icon">
                    <FontAwesomeIcon  icon={faChartSimple} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-6 col-12">
              <div className="info-box">
                <span className="info-box-icon bg-warning">
                <FontAwesomeIcon  icon={faComment} />
                </span>
                <Link className="info-box-content" style={{ color: "black" }}>
                  <span className="info-box-text">Đã Nhận Tháng Này</span>
                  <span className="info-box-number">
                    {data.commentsStats.month} Bình Luận
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <div className="info-box">
                <span className="info-box-icon bg-info">
                <FontAwesomeIcon  icon={faChartSimple} />
                </span>
                <Link className="info-box-content" style={{ color: "black" }}>
                  <span className="info-box-text">Được Duyệt Tháng Này</span>
                  <span className="info-box-number">
                    {data.publicArticlesStats.month} Bài Viết
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <div className="info-box">
                <span className="info-box-icon bg-danger">
                <FontAwesomeIcon  icon={faChartSimple} />
                </span>
                <Link className="info-box-content" style={{ color: "black" }}>
                  <span className="info-box-text">Bị Từ Chối Tháng Này</span>
                  <span className="info-box-number">
                    {data.rejectedArticlesStats.month} Bài Viết
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-6 col-12">
              <div className="info-box">
              <span className="info-box-icon bg-warning">
                <FontAwesomeIcon  icon={faComment} />
                </span>
                <Link className="info-box-content" style={{ color: "black" }}>
                  <span className="info-box-text">Đã Nhận Tuần Này</span>
                  <span className="info-box-number">
                    {data.commentsStats.week} Bình Luận
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <div className="info-box">
                <span className="info-box-icon bg-info">
                <FontAwesomeIcon  icon={faChartSimple} />
                </span>
                <Link className="info-box-content" style={{ color: "black" }}>
                  <span className="info-box-text">Được Duyệt Tuần Này</span>
                  <span className="info-box-number">
                    {data.publicArticlesStats.week} Bài Viết
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <div className="info-box">
                <span className="info-box-icon bg-danger">
                <FontAwesomeIcon  icon={faChartSimple} />
                </span>
                <Link className="info-box-content" style={{ color: "black" }}>
                  <span className="info-box-text">Bị Từ Chối Tuần Này</span>
                  <span className="info-box-number">
                    {data.rejectedArticlesStats.week} Bài Viết
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <section className="col-lg-12 connectedSortable ui-sortable">
              <div className="card bg-gradient-white">
                <div className="card-header border-0">
                  <h3 className="card-title">
                    <i className="fas fa-th mr-1" />
                    Số Lượt Like
                  </h3>
                </div>
                <div className="card-body">
                  <Line
                    data={articleChartData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                    height={400}
                  />
                </div>
              </div>
            </section>
            <section className="col-lg-6 connectedSortable ui-sortable">
              <div className="card bg-gradient-white">
                <div className="card-header border-0">
                  <h3 className="card-title">
                    <i className="fas fa-th mr-1" />
                    Số Lượt Xem
                  </h3>
                </div>
                <div className="card-body">
                  <Line
                    data={commentChartData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                    height={400}
                  />
                </div>
              </div>
            </section>
            <section className="col-lg-6 connectedSortable ui-sortable">
              <div className="card bg-gradient-white">
                <div className="card-header border-0">
                  <h3 className="card-title">
                    <i className="fas fa-th mr-1" />
                    Lượt Theo Dõi
                  </h3>
                </div>
                <div className="card-body">
                  <Line
                    data={usersRegisteredPerMonth}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                    height={400}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThongKe;
