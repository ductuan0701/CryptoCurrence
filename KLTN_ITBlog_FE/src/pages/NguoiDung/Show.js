import React, { useState, useEffect } from 'react';
import ContentHeader from '../../components/ContentHeader';
import { Link, useNavigate } from 'react-router-dom';
import NguoiDungServices from '../../services/NguoiDungServices'; // Import service để gọi API
import { useParams } from 'react-router-dom';

const Show = () => {
  const [fullname, setFulname] = useState(''); // State cho tên chuyên mục
  const [username, setUsername] = useState(''); // State cho slug/đường dẫn
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState(''); // State cho file hình ảnh
  const [follower, setFollower] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const navigate = useNavigate(); // Điều hướng sau khi thêm thành công

  const { id } = useParams();

  const breadcrumbs = [
    { label: 'Trang Chủ', url: '/' },
    { label: 'Người Dùng', url: '/admin/nguoi-dung' },
    { label: 'Thông Tin', url: '' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const show = await NguoiDungServices.show(id);
      if(show.status === 200){
        setFulname(show.data.user.fullname)
        setUsername(show.data.user.username)
        setEmail(show.data.user.email)
        setBio(show.data.user.bio)
        setCreatedAt(show.data.user.createdAt)
        setFollower(show.data.followerCount)
      }else{
        navigate('/admin/nguoi-dung'); 
      }
    }

    fetchData();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: '1203.31px' }}>
      <ContentHeader title='Thông Tin' breadcrumbs={breadcrumbs} />
      <section className="content">
        <div className="container-fluid">
          <div className="card card-default">
            <div className="card-body">
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="name">Họ Tên</label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="name"
                        name="name"
                        value={fullname ?? ''}
                        disabled
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="name">Tài Khoản</label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="name"
                        name="name"
                        value={username ?? ''}
                        disabled
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="name">Email</label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="name"
                        name="name"
                        value={email ?? ''}
                        disabled
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="name">Bio</label>
                      <textarea
                        type="text"
                        className="form-control bg-white"
                        id="name"
                        name="name"
                        value={bio ?? ''}
                        disabled
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="name">Người Theo Dõi</label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="name"
                        name="name"
                        value={follower + ' người theo dõi' ?? ''}
                        disabled
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="name">Ngày tham gia</label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="name"
                        name="name"
                        value={createdAt ?? ''}
                        disabled
                        required
                      />
                    </div>
                  </div>
                </div>
                <Link className="btn btn-success mr-2" to="/admin/nguoi-dung">Quay Lại</Link>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Show;
