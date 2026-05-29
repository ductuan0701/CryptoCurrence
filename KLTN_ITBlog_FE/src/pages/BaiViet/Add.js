import React, { useState, useEffect } from 'react';
import ContentHeader from '../../components/ContentHeader';
import { Link, useNavigate } from 'react-router-dom';
import BaiVietServices from '../../services/BaiVietServices'; // Import service để gọi API
import ChungServices from '../../services/ChungServices'; // Import service để gọi API
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Select from 'react-select';

const Add = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState(''); // State cho phần content
  const [categories, setCategories] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  const breadcrumbs = [
    { label: 'Trang Chủ', url: '/' },
    { label: 'Bài Viết', url: '/admin/bai-viet' },
    { label: 'Thêm Bài Viết', url: '' },
  ];

  // Hàm chuyển đổi tiêu đề thành slug
  const createSlug = (title) => {
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

    return vietnameseToAscii(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // Thay thế ký tự không phải chữ cái hoặc số bằng dấu gạch ngang
      .replace(/(^-|-$)/g, '');     // Xóa dấu gạch ngang đầu hoặc cuối
  };

  const getCategories = async () => {
    const response = await ChungServices.list_categories();
    const categoriesOptions = response.data.categories.map((category) => ({
      value: category.category_id,
      label: category.name,
    }));
    setCategories(categoriesOptions);
  };

  useEffect(() => {
    getCategories();
    setSlug(createSlug(title));
  }, [title]);

  const handleSubmit = async (e, is_draft = 0) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('tags', tags);
    formData.append('is_draft', is_draft);
    formData.append('image_url', image);
    formData.append('content', content); // Thêm phần content vào FormData
    formData.append("categories", JSON.stringify(selectedCategories));

    const addArticle = await BaiVietServices.add(formData);

    if (addArticle.status === 201) {
      if (is_draft === 1) {
        toast.success("Đã lưu bản nháp bài viết");
        navigate(`/admin/bai-viet/${addArticle.data.article.article_id}`);
      } else {
        toast.success(addArticle.data.message);
      }
      navigate(`/admin/bai-viet`);
    } else {
      toast.error(addArticle.response.data.message);
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };

  return (
    <div className="content-wrapper" style={{ minHeight: '1203.31px' }}>
      <ContentHeader title='Thêm Bài Viết' breadcrumbs={breadcrumbs} />
      <section className="content">
        <div className="container-fluid">
          <div className='row'>
            <div className='col-md-8'>
              <div className="card card-default">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <CKEditor
                          editor={ClassicEditor}
                          data={content || ''}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setContent(data); // Cập nhật state content
                          }}
                          config={{
                            toolbar: [
                              'heading', '|',
                              'bold', 'italic', '|',
                              'link', 'imageUpload', 'blockQuote', '|',
                              'bulletedList', 'numberedList', '|',
                              'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
                              'mediaEmbed', '|',
                              'outdent', 'indent', '|',
                              'undo', 'redo', '|'
                            ],
                            image: {
                              toolbar: [
                                'imageTextAlternative', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side', 'linkImage'
                              ]
                            },
                            table: {
                              contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                            },
                            ckfinder: {
                              uploadUrl: `${process.env.REACT_APP_API_URL}/articles/uploadImage`
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className="card card-default">
                <div className="card-body">
                  <div className="row mb-2">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="title">Tiêu Đề</label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          name="title"
                          placeholder="Tiêu Đề"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
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
                          onChange={(e) => setSlug(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="categories">Chọn Danh Mục</label>
                        <Select
                          isMulti
                          name="categories"
                          options={categories} // Danh sách các tùy chọn
                          className="basic-multi-select"
                          classNamePrefix="select"
                          value={selectedCategories}
                          onChange={handleCategoryChange}
                          placeholder="Chọn danh mục"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="tags">Từ Khóa</label>
                        <input
                          type="text"
                          className="form-control"
                          id="tags"
                          name="tags"
                          placeholder="Từ khóa cách bởi dấu ,"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
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
                          onChange={(e) => setImage(e.target.files[0])}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <Link className="btn btn-success mr-2" to="/admin/bai-viet">Quay Lại</Link>
                  <button className="btn btn-info mr-2" onClick={(e) => handleSubmit(e, 1)}>Lưu Bản Nháp</button>
                  <button className="btn btn-primary" onClick={(e) => handleSubmit(e)}>Đăng Bài Viết</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Add;
