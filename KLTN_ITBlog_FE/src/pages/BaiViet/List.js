import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ContentHeader from "../../components/ContentHeader";
import Table from "../../components/Table";
import BaiVietServices from "../../services/BaiVietServices";
import { toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";

const List = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state cho từ khóa tìm kiếm
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState("");
  const [rejectId, setRejectId] = useState(-1);

  const breadcrumbs = [
    { label: "Trang Chủ", url: "/admin" },
    { label: "Bài Viết", url: "" },
  ];

  const headers = [
    "#",
    "Hình Ảnh",
    "Tiêu Đề",
    "Lượt Xem",
    "Tác Giả",
    "Trạng Thái",
    "Phiên bản",
    "Hành Động",
  ];

  const fetchData = async (page = 1, search = "") => {
    try {
      const response = await BaiVietServices.list(page, search);
      setData(response.data.articles); // Cập nhật state data với danh sách bài viết
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchTerm); // Gọi API với từ khóa tìm kiếm
    window.scrollTo(0, 0);
  }, [currentPage, searchTerm]);

  const renderRow = (item, index) => (
    <>
      <td>{index + 1}</td>
      <td>
        <img
          src={`${process.env.REACT_APP_API_URL}/${item.image_url}`}
          alt={item.title}
          style={{ width: "200px", height: "100px" }}
        />
      </td>
      <td>{item.title}</td>
      <td>
        <span className="badge badge-success">
          <i className="fa-regular fa-eye"></i>{" "}
          {item.views.length === 0
            ? "0 lượt xem"
            : `${item.views[0].view_count} lượt xem`}
        </span>
      </td>
      <td>
        <Link to={`/admin/nguoi-dung/${item.user.username}`}>
          {item.user.username}
        </Link>
      </td>
      <td>
        {item.privacy === "public" ? (
          <span className="badge badge-primary">Đã Duyệt Bài</span>
        ) : (
          <button
            className="btn btn-success btn-md d-flex align-items-center"
            style={{ padding: "4px 8px" }}
            onClick={() => handlePublic(item.article_id)}
          >
            <i className="fa-solid fa-check" style={{ marginRight: "5px" }}></i>
            <span>Duyệt</span>
          </button>
        )}
      </td>
      <td>
        {item.is_draft === true ? (
          <span className="badge badge-danger">Bản Nháp</span>
        ) : (
          <span className="badge badge-primary">Chính Thức</span>
        )}
      </td>
      <td>
        <div className="d-flex align-items-center">
          <Link
            to={`/admin/bai-viet/${item.article_id}`}
            className="btn btn-primary me-2 d-flex align-items-center"
            style={{ color: "white", padding: "8px 12px" }}
          >
            <i className="fas fa-edit" />
            <span className="pl-2">XEM</span>
          </Link>
          <Button
            variant="danger"
            onClick={() => handleDelete(item.article_id)}
            className="ml-1 d-flex align-items-center"
            style={{ color: "white", padding: "8px 12px" }}
          >
            <i className="fa-solid fa-trash"></i>
            <span className="pl-2">Xóa</span>
          </Button>
        </div>
      </td>
    </>
  );
  // Xử lý duyệt bài viết
  const handlePublic = async (id) => {
    try {
      const response = await BaiVietServices.public(id);
      setData(
        data.map((item) => {
          if (item.article_id === id) {
            // Kiểm tra role và thay đổi
            return { ...item, privacy: "public", is_draft: 0 };
          }
          return item;
        })
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Lỗi khi duyệt bài viết");
    }
  };

  // Xử lý xóa bài viết
  const handleDelete = async (id) => {
    try {
      const destroy = await BaiVietServices.delete(id);
      setData(data.filter((item) => item.article_id !== id));
      toast.success(destroy.data.message);
    } catch (error) {
      toast.error("Lỗi khi xóa bài viết");
    }
  };

  // Xử lý khi người dùng thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Xử lý khi người dùng nhập vào ô tìm kiếm
  const handleSearch = (term) => {
    setSearchTerm(term); // Cập nhật từ khóa tìm kiếm
  };

  const handleShowReject = (id) => {
    setShow(true);
    setRejectId(id);
  };

  const handleReject = async () => {
    if (!reason || rejectId === -1) {
      toast.error("Vui lòng chọn bài viết và nhập đủ nội dung từ chối!");
      return;
    } else {
      try {
        const response = await BaiVietServices.reject(rejectId, { reason });
        toast.success(response.data.message);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
      setShow(false);
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: "1203.31px" }}>
      <ContentHeader title="Bài Viết" breadcrumbs={breadcrumbs} />
      <Table
        headers={headers}
        renderRow={renderRow}
        data={data}
        addPath="/admin/bai-viet/them/"
        addText="Thêm Bài Viết"
        onSearch={handleSearch} // Truyền hàm xử lý tìm kiếm xuống Table
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
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header>
          <Modal.Title>Từ Chối Bài Viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reason" className="mb-3">
              <Form.Control
                as="textarea" // Change type to textarea
                placeholder="Nhập lý do từ chối"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4} // Set the number of rows to adjust the height
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-success" onClick={() => setShow(false)}>
            Hủy
          </Button>
          <Button className="btn btn-dark" onClick={() => handleReject()}>
            Từ Chối
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default List;
