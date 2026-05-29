import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ContentHeader from "../../components/ContentHeader";
import Table from "../../components/Table";
import NguoiDungServices from "../../services/NguoiDungServices";
import { toast } from "react-toastify";

const List = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const breadcrumbs = [
    { label: "Trang Chủ", url: "/admin" },
    { label: "Người Dùng", url: "" },
  ];

  const headers = [
    "#",
    "Hình Ảnh",
    "Họ Tên",
    "Email",
    "Tài Khoản",
    "Phân Quyền",
    "Hành Động",
  ];

  const fetchData = async (page = 1, search = "") => {
    try {
      const response = await NguoiDungServices.list(page, search);
      setData(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchTerm);
    window.scrollTo(0, 0);
  }, [currentPage, searchTerm]);

  const handleToggleAdmin = async (id) => {
    try {
      const response = await NguoiDungServices.toggleAdmin(id);
      if (response.status === 200) {
        setData((prevData) =>
          prevData.map((item) =>
            item.user_id === id
              ? { ...item, role: item.role === "admin" ? "user" : "admin" }
              : item
          )
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi vai trò người dùng:", error);
      toast.error("Có lỗi xảy ra khi thay đổi vai trò.");
    }
  };

  const handleBlock = async (id) => {
    try {
      const response = await NguoiDungServices.block(id);
      if (response.status === 200) {
        setData((prevData) =>
          prevData.map((item) =>
            item.user_id === id
              ? { ...item, role: item.role === "blocked" ? "user" : "blocked" }
              : item
          )
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cấm tài khoản");
    }
  };

  const renderRow = (item, index) => (
    <>
      <td>{index + 1}</td>
      <td>
        <img
          src={`${process.env.REACT_APP_API_URL}/${item.avatar_url}`}
          alt={item.fullname}
          style={{ width: "100px", height: "100px" }}
        />
      </td>
      <td>{item.fullname}</td>
      <td>{item.email}</td>
      <td>{item.username}</td>
      <td>
        {item.role === "admin" ? (
          <span className="badge badge-danger">Quản trị viên</span>
        ) : (
          <span className="badge badge-success">Người dùng</span>
        )}
      </td>
      <td>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "5px",
          }}
        >
          <Link
            to={`/admin/nguoi-dung/${item.user_id}`}
            className="btn btn-primary"
            style={{ color: "white" }}
          >
            <i className="fas fa-edit" />
            <span> XEM</span>
          </Link>
          {item.role !== "blocked" && item.role !== "admin" ? (
            <button
              className="btn btn-danger"
              style={{ color: "white" }}
              onClick={() => handleBlock(item.user_id)}
            >
              <i className="fa-solid fa-lock"></i>
              <span> Cấm </span>
            </button>
          ) : item.role === "blocked" ? (
            <button
              className="btn btn-success"
              style={{ color: "white" }}
              onClick={() => handleBlock(item.user_id)}
            >
              <i className="fa-solid fa-lock-open"></i>
              <span> Bỏ Cấm</span>
            </button>
          ) : null}
          <button
            className="btn btn-warning"
            style={{ color: "white" }}
            onClick={() => handleToggleAdmin(item.user_id)}
          >
            <i className="fa-solid fa-user-shield"></i>
            <span>
              {" "}
              {item.role === "admin"
                ? "Chuyển thành User"
                : "Chuyển thành Admin"}
            </span>
          </button>
        </div>
      </td>
    </>
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div
      className="content-wrapper"
      style={{ minHeight: "1203.31px", marginBottom: "50px" }}
    >
      <ContentHeader title="Người Dùng" breadcrumbs={breadcrumbs} />
      <Table
        headers={headers}
        renderRow={renderRow}
        data={data}
        onSearch={handleSearch}
      />
      <ul className="pagination pagination-sm ml-3 mt-1 float-left">
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index}>
            <button
              className="page-link"
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
