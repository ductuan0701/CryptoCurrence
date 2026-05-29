import React, { useState, useEffect } from "react";
import ContentHeader from "../../components/ContentHeader";
import { Link, useNavigate } from "react-router-dom";
import BaiVietServices from "../../services/BaiVietServices"; // Import service để gọi API
import ChungServices from "../../services/ChungServices"; // Import service để gọi API
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { Modal, Button, Form } from "react-bootstrap";

const Show = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [privacy, setPrivacy] = useState("private");
  const [categories, setCategories] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();
  const [rejectId, setRejectId] = useState(-1);
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState([]);
  const [customReason, setCustomReason] = useState("");
  const { id } = useParams();

  const handleReasonChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setReason((prevReason) => [...prevReason, value]); 
    } else {
      setReason((prevReason) => prevReason.filter((item) => item !== value)); 
    }
  };

  const breadcrumbs = [
    { label: "Trang Chủ", url: "/" },
    { label: "Bài Viết", url: "/admin/bai-viet" },
    { label: "Chỉnh Sửa", url: "" },
  ];

  // Hàm chuyển đổi tiêu đề thành slug
  const createSlug = (title) => {
    // Bản đồ chuyển đổi các ký tự có dấu thành không dấu
    const vietnameseToAscii = (str) => {
      const map = {
        à: "a",
        á: "a",
        ả: "a",
        ã: "a",
        ạ: "a",
        ă: "a",
        ằ: "a",
        ắ: "a",
        ẳ: "a",
        ẵ: "a",
        ặ: "a",
        â: "a",
        ầ: "a",
        ấ: "a",
        ẩ: "a",
        ẫ: "a",
        ậ: "a",
        è: "e",
        é: "e",
        ẻ: "e",
        ẽ: "e",
        ẹ: "e",
        ê: "e",
        ề: "e",
        ế: "e",
        ể: "e",
        ễ: "e",
        ệ: "e",
        ì: "i",
        í: "i",
        ỉ: "i",
        ĩ: "i",
        ị: "i",
        ò: "o",
        ó: "o",
        ỏ: "o",
        õ: "o",
        ọ: "o",
        ô: "o",
        ồ: "o",
        ố: "o",
        ổ: "o",
        ỗ: "o",
        ộ: "o",
        ơ: "o",
        ờ: "o",
        ớ: "o",
        ở: "o",
        ỡ: "o",
        ợ: "o",
        ù: "u",
        ú: "u",
        ủ: "u",
        ũ: "u",
        ụ: "u",
        ư: "u",
        ừ: "u",
        ứ: "u",
        ử: "u",
        ữ: "u",
        ự: "u",
        ỳ: "y",
        ý: "y",
        ỷ: "y",
        ỹ: "y",
        ỵ: "y",
        đ: "d",
        // Thêm các ký tự khác nếu cần
      };
      return str.replace(/./g, (char) => map[char] || char);
    };

    return vietnameseToAscii(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Thay thế ký tự không phải chữ cái hoặc số bằng dấu gạch ngang
      .replace(/(^-|-$)/g, ""); // Xóa dấu gạch ngang đầu hoặc cuối
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
    const fetchData = async () => {
      const detail = await BaiVietServices.detail(id);
      if (detail.status === 200) {
        setTitle(detail.data.article.title);
        setSlug(detail.data.article.slug);
        setTags(detail.data.article.tags);
        setContent(detail.data.article.content);
        setIsDraft(detail.data.article.is_draft);
        setPrivacy(detail.data.article.privacy);

        const selectedCategoriesDefault = detail.data.categories.map(
          (category) => ({
            value: category.category_id,
            label: category.name,
          })
        );
        setSelectedCategories(selectedCategoriesDefault);
      } else {
        navigate("/admin/bai-viet");
      }
    };

    fetchData();
    getCategories();
    window.scrollTo(0, 0);
  }, []);

  const handleTitleChange = (e, title) => {
    e.preventDefault();
    setTitle(title);
    setSlug(createSlug(title));
  };

  const handleSubmit = async (e, is_draft = 0) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("tags", tags);
    formData.append("is_draft", is_draft);
    formData.append("image_url", image);
    formData.append("content", content); // Thêm phần content vào FormData
    formData.append("categories", JSON.stringify(selectedCategories));

    const addArticle = await BaiVietServices.update(id, formData);

    if (addArticle.status === 200) {
      if (is_draft === 1) {
        setIsDraft(true);
        toast.success("Đã lưu bản nháp bài viết");
      } else {
        setIsDraft(false);
        toast.success(addArticle.data.message);
      }
    } else {
      toast.error(addArticle.response.data.message);
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };
  const handleShowReject = (id) => {
    setShow(true);
    setRejectId(id);
  };
  const handleReject = async () => {
    const finalReason =
      reason.includes("Khác") && customReason
        ? [...reason.filter((r) => r !== "Khác"), customReason]
        : reason;

    if (finalReason.length === 0 || rejectId === -1) {
      toast.error("Vui lòng chọn bài viết và nhập đủ nội dung từ chối!");
      return;
    }

    try {
      const response = await BaiVietServices.reject(rejectId, {
        reason: finalReason,
      });
      toast.success(response.data.message);
      setShow(false);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      toast.error("Đã xảy ra lỗi khi từ chối bài viết!");
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: "1203.31px" }}>
      <ContentHeader title="Chỉnh Sửa" breadcrumbs={breadcrumbs} />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="card card-default">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <CKEditor
                          editor={ClassicEditor}
                          data={content || ""}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setContent(data); // Cập nhật state content
                          }}
                          config={{
                            toolbar: [
                              "heading",
                              "|",
                              "bold",
                              "italic",
                              "|",
                              "link",
                              "imageUpload",
                              "blockQuote",
                              "|",
                              "bulletedList",
                              "numberedList",
                              "|",
                              "insertTable",
                              "tableColumn",
                              "tableRow",
                              "mergeTableCells",
                              "|",
                              "mediaEmbed",
                              "|",
                              "outdent",
                              "indent",
                              "|",
                              "undo",
                              "redo",
                              "|",
                            ],
                            image: {
                              toolbar: [
                                "imageTextAlternative",
                                "imageStyle:inline",
                                "imageStyle:block",
                                "imageStyle:side",
                                "linkImage",
                              ],
                            },
                            table: {
                              contentToolbar: [
                                "tableColumn",
                                "tableRow",
                                "mergeTableCells",
                              ],
                            },
                            ckfinder: {
                              uploadUrl: `${process.env.REACT_APP_API_URL}/articles/uploadImage`,
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
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
                          onChange={(e) => handleTitleChange(e, e.target.value)}
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
                        <label htmlFor="categories">Chọn Danh Mục</label>
                        <Select
                          isMulti
                          name="categories"
                          options={categories}
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
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="tags">Phiên Bản</label>
                        <input
                          type="text"
                          className="form-control bg-white"
                          id="draft"
                          name="draft"
                          value={isDraft ? "Bản Nháp" : "Chính Thức"}
                          required
                          disabled
                          style={{ cursor: "not-allowed" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 d-flex flex-wrap justify-content-center">
                    <Link
                      className="btn btn-success mr-2 mb-2"
                      to="/admin/bai-viet"
                    >
                      Quay Lại
                    </Link>
                    <button
                      className="btn btn-info mr-2 mb-2"
                      onClick={(e) => handleSubmit(e, 1)}
                    >
                      Lưu Bản Nháp
                    </button>
                    <button
                      className="btn btn-primary mr-2 mb-2"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Đăng Bài Viết
                    </button>

                    {privacy === "private" && (
                      <button
                        className="btn btn-dark mb-2"
                        onClick={() => handleShowReject(id)}
                      >
                        <i className="fa-regular fa-circle-xmark"></i> Từ Chối
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header>
          <Modal.Title>Từ Chối Bài Viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reasonSelection" className="mb-3">
              <Form.Label>Chọn lý do từ chối</Form.Label>
              <Form.Check
                type="checkbox"
                label="Nội dung không phù hợp"
                value="Nội dung không phù hợp"
                checked={reason.includes("Nội dung không phù hợp")}
                onChange={handleReasonChange}
              />

              <Form.Check
                type="checkbox"
                label="Vi phạm chính sách"
                value="Vi phạm chính sách"
                checked={reason.includes("Vi phạm chính sách")}
                onChange={handleReasonChange}
              />

              <Form.Check
                type="checkbox"
                label="Thiếu thông tin cần thiết"
                value="Thiếu thông tin cần thiết"
                checked={reason.includes("Thiếu thông tin cần thiết")}
                onChange={handleReasonChange}
              />

              <Form.Check
                type="checkbox"
                label="Ngôn ngữ không rõ ràng hoặc sai chính tả"
                value="Ngôn ngữ không rõ ràng hoặc sai chính tả"
                checked={reason.includes(
                  "Ngôn ngữ không rõ ràng hoặc sai chính tả"
                )}
                onChange={handleReasonChange}
              />

              <Form.Check
                type="checkbox"
                label="Không đúng chủ đề hoặc danh mục"
                value="Không đúng chủ đề hoặc danh mục"
                checked={reason.includes("Không đúng chủ đề hoặc danh mục")}
                onChange={handleReasonChange}
              />

              <Form.Check
                type="checkbox"
                label="Hình ảnh không phù hợp hoặc chất lượng kém"
                value="Hình ảnh không phù hợp hoặc chất lượng kém"
                checked={reason.includes(
                  "Hình ảnh không phù hợp hoặc chất lượng kém"
                )}
                onChange={handleReasonChange}
              />

              <Form.Check
                type="checkbox"
                label="Thông tin gây hiểu lầm hoặc không chính xác"
                value="Thông tin gây hiểu lầm hoặc không chính xác"
                checked={reason.includes(
                  "Thông tin gây hiểu lầm hoặc không chính xác"
                )}
                onChange={handleReasonChange}
              />

              <Form.Check
                type="checkbox"
                label="Khác"
                value="Khác"
                checked={reason.includes("Khác")}
                onChange={handleReasonChange}
              />
            </Form.Group>

            {reason.includes("Khác") && (
              <Form.Group controlId="customReason" className="mb-3">
                <Form.Control
                  as="textarea"
                  placeholder="Nhập lý do từ chối"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={4}
                />
              </Form.Group>
            )}

            <div className="mt-3">
              <strong>Lý do đã chọn:</strong>
              <div className="selected-reasons">
                {reason.length > 0
                  ? reason.includes("Khác") && customReason
                    ? `${reason
                        .filter((r) => r !== "Khác")
                        .join(", ")}. ${customReason}`
                    : reason.join(", ")
                  : "Chưa chọn lý do"}
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-success" onClick={() => setShow(false)}>
            Hủy
          </Button>
          <Button
            className="btn btn-dark"
            onClick={() =>
              handleReject(
                reason.includes("Khác") && customReason
                  ? [...reason.filter((r) => r !== "Khác"), customReason]
                  : reason
              )
            }
          >
            Từ Chối
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Show;
