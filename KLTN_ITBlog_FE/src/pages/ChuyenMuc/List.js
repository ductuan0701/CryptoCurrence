import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup } from 'react-bootstrap';
import ContentHeader from '../../components/ContentHeader';
import Table from '../../components/Table';
import ChuyenMucServices from '../../services/ChuyenMucServices';
import { toast } from 'react-toastify';

const List = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); 

  const breadcrumbs = [
    { label: 'Trang Chủ', url: '/admin' },
    { label: 'Chuyên Mục', url: '' },
  ];

  const headers = ['#', 'Hình Ảnh', 'Tên Chuyên Mục', 'Đường Dẫn', 'Hành Động'];

  const fetchData = async (page = 1, search = '') => {
    try {
      const response = await ChuyenMucServices.list(page, search);
      setData(response.data.categories); 
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
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
          alt={item.name}
          style={{ width: '200px', height: '100px' }}
        />
      </td>
      <td>{item.name}</td>
      <td>{item.slug}</td>
      <td>
        <ButtonGroup>
          <Link
            to={`/admin/chuyen-muc/${item.category_id}`}
            className='btn btn-primary'
            style={{ marginRight: '5px' }}
          >
            <i className='fas fa-edit' />
            <span> XEM</span>
          </Link>
          <Button
            variant='danger'
            onClick={() => handleDelete(item.category_id)}
          >
            <i className='fa-solid fa-trash'></i>
            <span> Xóa</span>
          </Button>
        </ButtonGroup>
      </td>
    </>
  );

  // Xử lý xóa chuyên mục
  const handleDelete = async (categoryId) => {
    try {
      const destroy = await ChuyenMucServices.delete(categoryId);
      setData(data.filter((item) => item.category_id !== categoryId));
      toast.success(destroy.data.message);
    } catch (error) {
      toast.error('Lỗi khi xóa chuyên mục');
    }
  };

  // Xử lý khi người dùng thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Xử lý khi người dùng nhập vào ô tìm kiếm
  const handleSearch = (term) => {
    setSearchTerm(term); 
  };

  return (
    <div className='content-wrapper' style={{ minHeight: '1203.31px', marginBottom: '50px' }}>
      <ContentHeader title='Chuyên Mục' breadcrumbs={breadcrumbs} />
      <Table
        headers={headers}
        renderRow={renderRow}
        data={data}
        addPath='/admin/chuyen-muc/them/'
        addText='Thêm Chuyên Mục'
        onSearch={handleSearch}
      />
      <ul className='pagination pagination-sm ml-3 mt-1 float-left'>
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index}>
            <button
              className='page-link'
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
