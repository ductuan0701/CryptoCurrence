import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContentHeader from '../../components/ContentHeader';
import Table from '../../components/Table';
import BinhLuanServices from '../../services/BinhLuanServices';
import { toast } from 'react-toastify';

const List = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // Thêm state cho từ khóa tìm kiếm

  const breadcrumbs = [
    { label: 'Trang Chủ', url: '/admin' },
    { label: 'Bình Luận', url: '' },
  ];

  const headers = ["#", "Bài Viết", "Người Bình Luận", "Nội Dung", "Thời Gian", "Hành Động"];

  const fetchData = async (page = 1, search = "") => {
    try {
      const response = await BinhLuanServices.list(page, search);
      setData(response.data.comments); // Cập nhật state data với danh sách bình luận
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchTerm); // Gọi API với từ khóa tìm kiếm
  }, [currentPage, searchTerm]);

  const renderRow = (item, index) => (
    <>
      <td>{index + 1}</td>
      <td><Link to={`/bai-viet/${item.article.slug}`}>{item.article.title}</Link></td>
      <td><Link to={`/admin/nguoi-dung/${item.user.username}`}>{item.user.username}</Link></td>
      <td>{item.content}</td>
      <td>{item.createdAt}</td>
      <td>
        <button className="btn btn-danger" style={{ color: 'white' }} onClick={() => handleDelete(item.comment_id)}>
          <i className="fa-solid fa-trash"></i>
          <span> Xóa</span>
        </button>
      </td>
    </>
  );

  // Xử lý xóa bình luận
  const handleDelete = async (id) => {
    try {
      const destroy = await BinhLuanServices.delete(id);
      setData(data.filter(item => item.comment_id !== id));
      toast.success(destroy.data.message);
    } catch (error) {
      toast.error("Lỗi khi xóa bình luận");
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

  return (
    <div className="content-wrapper" style={{ minHeight: '1203.31px' }}>
      <ContentHeader title="Bình Luận" breadcrumbs={breadcrumbs} />
      <Table 
        headers={headers} 
        renderRow={renderRow} 
        data={data} 
        onSearch={handleSearch} // Truyền hàm xử lý tìm kiếm xuống Table
      />
      <ul className="pagination pagination-sm ml-3 mt-1 float-left">
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index}>
            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
