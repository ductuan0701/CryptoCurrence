import React, { useState, useEffect } from 'react';
import ContentHeader from '../../components/ContentHeader';
import { Link, useNavigate } from 'react-router-dom';
import ChuyenMucServices from '../../services/ChuyenMucServices'; // Import service để gọi API
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const Show = () => {
  const [name, setName] = useState(''); // State cho tên chuyên mục
  const [slug, setSlug] = useState(''); // State cho slug/đường dẫn
  const [image, setImage] = useState(null); // State cho file hình ảnh
  const navigate = useNavigate(); // Điều hướng sau khi thêm thành công

  const { id } = useParams();

  const breadcrumbs = [
    { label: 'Trang Chủ', url: '/' },
    { label: 'Chuyên Mục', url: '/admin/chuyen-muc' },
    { label: 'Chi Tiết', url: '' },
  ];

  // Hàm chuyển đổi tiêu đề thành slug
  const createSlug = (name) => {
    // Bản đồ chuyển đổi các ký tự có dấu thành không dấu
    const vietnameseToAscii = (str) => {
      const map = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
        // Thêm các ký tự khác nếu cần
      };
      return str.replace(/./g, char => map[char] || char);
    };

    return vietnameseToAscii(name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // Thay thế ký tự không phải chữ cái hoặc số bằng dấu gạch ngang
      .replace(/(^-|-$)/g, '');     // Xóa dấu gạch ngang đầu hoặc cuối
  };

  useEffect(() => {
    const fetchData = async () => {
      const show = await ChuyenMucServices.show(id);
      if(show.status === 200){
        setName(show.data.name)
        setSlug(show.data.slug)
      }else{
        navigate('/admin/chuyen-muc'); 
      }
    }

    fetchData();
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('image_url', image);
    
    const update = await ChuyenMucServices.update(id, formData);

    if(update.status === 200){
      toast.success(update.data.message);
      setName(update.data.category.name);
      setSlug(update.data.category.slug);
    }else{
      toast.success(update.response.data.message);
    }
  };

  const handleTitleChange = (e, name) => {
    e.preventDefault();
    setName(name)
    setSlug(createSlug(name));
  }

  return (
    <div className="content-wrapper" style={{ minHeight: '1203.31px' }}>
      <ContentHeader title='Chi Tiết' breadcrumbs={breadcrumbs} />
      <section className="content">
        <div className="container-fluid">
          <div className="card card-default">
            <div className="card-body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="name">Tên Chuyên Mục</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Tên chuyên mục"
                        value={name}
                        onChange={(e) => handleTitleChange(e, e.target.value)} // Cập nhật state name
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="slug">Đường Dẫn</label>
                      <input
                        type="text"
                        className="form-control"
                        id="slug"
                        name="slug"
                        placeholder="Đường dẫn"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)} // Cập nhật state slug
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="image">Hình Ảnh</label>
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        name="image"
                        onChange={(e) => setImage(e.target.files[0])} // Cập nhật file ảnh
                      />
                    </div>
                  </div>
                </div>
                <Link className="btn btn-success mr-2" to="/admin/chuyen-muc">Quay Lại</Link>
                <button className="btn btn-primary" type="submit">Cập Nhật</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Show;
