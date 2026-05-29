import axiosInstance from './index';

const ChungServices = {

    // Lấy danh sách chuyên mục
    list_categories: async () => {
        try {
            const response = await axiosInstance.get(`/others/list_categories`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Lấy thông báo user
    notification: async () => {
        try {
            const response = await axiosInstance.get(`/notifications`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Xóa một thông báo theo ID
    deleteNotificationById: async (id) => {
        try {
            const response = await axiosInstance.delete(`/notifications/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Xóa tất cả thông báo của một người dùng
    deleteAllNotificationsByUser: async () => {
        try {
            const response = await axiosInstance.delete(`/notifications`);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default ChungServices;
