import axiosInstance from './index';

const BinhLuanServices = {
    // Danh sách bình luận
    list: async (page = 1, search = "") => {
        try {
            const response = await axiosInstance.get(`/comments/?page=${page}&search=${search}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Xóa bài viết
    delete: async (id) => {
        try {
            const response = await axiosInstance.delete(`/comments/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default BinhLuanServices;
