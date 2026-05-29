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

const Statistic = () => {
  const [data, setData] = useState({
    approvedArticles: { day: 0, week: 0, month: 0 },
    rejectedArticles: { day: 0, week: 0, month: 0 },
    newUsers: { day: 0, week: 0, month: 0 },
    articlesPerMonth: Array(12).fill(0),
    commentsPerMonth: Array(12).fill(0),
    usersRegisteredPerMonth: Array(12).fill(0),
  });

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Call API
    const fetchStatistics = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/others/statistics`);
        // console.log(`${process.env.REACT_APP_API_URL}/others/statistics`)
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
        label: "Bài Viết",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.8)",
        hoverBorderColor: "rgba(75, 192, 192, 1)",
        data: data.articlesPerMonth,
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
        label: "Bình Luận",
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 99, 132, 0.8)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
        data: data.commentsPerMonth,
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
        label: "Lượt Đăng Ký",
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 99, 132, 0.8)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
        data: data.usersRegisteredPerMonth,
      },
    ],
  };

  return (
    <div className="content-wrapper" style={{ minHeight: "1203.31px" }}>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Dashboard</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link href="/admin/">Trang Chủ</Link>
                </li>
                <li className="breadcrumb-item active">Bảng Điều Khiển</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{data.approvedArticles.day} Bài Viết</h3>
                  <p>Đã Duyệt Hôm Nay</p>
                </div>
                <div className="icon">
                  <i className="ion ion-stats-bars" />
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{data.rejectedArticles.day} Bài Viết</h3>
                  <p>Từ Chối Hôm Nay</p>
                </div>
                <div className="icon">
                  <i className="ion ion-stats-bars" />
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>{data.newUsers.day} User</h3>
                  <p>Đăng Ký Hôm Nay</p>
                </div>
                <div className="icon">
                  <i className="ion ion-person-add" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-6 col-12">
              <div className="info-box">
                <span className="info-box-icon bg-info">
                  <i className="ion ion-stats-bars" />
                </span>
                <Link className="info-box-content" style={{ color: "black" }}>
                  <span className="info-box-text">Đã Duyệt Tháng Này</span>
                  <span className="info-box-number">
                    {data.approvedArticles.month} Bài Viết
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <div className="info-box">
                <span className="info-box-icon bg-danger">
                  <i className="ion-stats-bars" />
                </span>
                <Link className="info-box-content" style={{ color: "black" }}>
                  <span className="info-box-text">Từ Chối Tháng Này</span>
                  <span className="info-box-number">
                    {data.rejectedArticles.month} Bài Viết
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <div className="info-box">
                <span className="info-box-icon bg-warning">
                  <i className="ion ion-person-add" />
                </span>
                <Link className="info-box-content" style={{ color: "black" }}>
                  <span className="info-box-text">Đăng Ký Tháng Này</span>
                  <span className="info-box-number">
                    {data.newUsers.month} User
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-6 col-12">
              <div className="info-box">
                <span className="info-box-icon bg-info">
                  <i className="ion ion-stats-bars" />
                </span>
                <Link className="info-box-content" style={{ color: "black" }}>
                  <span className="info-box-text">Đã Duyệt Tuần Này</span>
                  <span className="info-box-number">
                    {data.approvedArticles.week} Bài Viết
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <div className="info-box">
                <span className="info-box-icon bg-danger">
                  <i className="ion-stats-bars" />
                </span>
                <Link className="info-box-content" style={{ color: "black" }}>
                  <span className="info-box-text">Từ Chối Tuần Này</span>
                  <span className="info-box-number">
                    {data.rejectedArticles.week} Bài Viết
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <div className="info-box">
                <span className="info-box-icon bg-warning">
                  <i className="ion ion-person-add" />
                </span>
                <Link className="info-box-content" style={{ color: "black" }}>
                  <span className="info-box-text">Đăng Ký Tuần Này</span>
                  <span className="info-box-number">
                    {data.newUsers.week} User
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
                    Số Bài Viết
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
                    Lượt Bình Luận
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
                    Lượt Đăng Ký
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

export default Statistic;
