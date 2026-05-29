import axiosInstance from '../index';

const TaiKhoanServices = {
    profile: async () => {
        try {
            const response = await axiosInstance.get('/users/profile');
            return response;
        } catch (error) {
            throw error;
        }
    },

    userByUsername: async (username) => {
        try {
            const response = await axiosInstance.get(`/users/${username}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    update: async (data) => {
        try {
            const response = await axiosInstance.put('/users', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    changePassword: async (data) => {
        try {
            const response = await axiosInstance.patch(`/users/changePassword`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getArticlesByUsername: async (username, page) => {
        try {
            const response = await axiosInstance.get(`/others/articles_username/${username}/?page=${page}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    checkFollowed: async (username) => {
        try {
            const response = await axiosInstance.get(`/followers/${username}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    follow: async (username) => {
        try {
            const response = await axiosInstance.post(`/followers/${username}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    listFollowersAndFollowings: async (id) => {
        try {
            const response = await axiosInstance.get(`/followers/${id}/listFollowerAndFollowing`);
            return response.data; 
        } catch (error) {
            throw error;
        }
    },
};

export default TaiKhoanServices;
