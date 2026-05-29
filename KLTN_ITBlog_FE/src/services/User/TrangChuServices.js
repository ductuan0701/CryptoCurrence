import axiosInstance from '../index';

const TrangChuServices = {
    getListCategory: async () => {
        try {
            const response = await axiosInstance.get('/others/list_categories');
            return response;
        } catch (error) {
            throw error;
        }
    },

    getListArticles: async (page, search = "") => {
        try {
            const response = await axiosInstance.get(`/others/list_articles?page=${page}&search=${search}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getListArticlesRecomend: async (page, search = "") => {
        try {
            const response = await axiosInstance.get(`/others/articles_recommend?page=${page}&search=${search}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getTopTrending: async () => {
        try {
            const response = await axiosInstance.get('/others/top_trendings');
            return response;
        } catch (error) {
            throw error;
        }
    },

    getMostPopular: async () => {
        try {
            const response = await axiosInstance.get('/others/most_popular');
            return response;
        } catch (error) {
            throw error;
        }
    },

    getLastComment: async () => {
        try {
            const response = await axiosInstance.get('/others/last_comments');
            return response;
        } catch (error) {
            throw error;
        }
    },

    getTopInteract: async () => {
        try {
            const response = await axiosInstance.get('/others/top_interacts');
            return response;
        } catch (error) {
            throw error;
        }
    },

    getNewUser: async () => {
        try {
            const response = await axiosInstance.get('/others/new_users');
            return response;
        } catch (error) {
            throw error;
        }
    },

    getTopCategories: async () => {
        try {
            const response = await axiosInstance.get('/others/top_categories');
            return response;
        } catch (error) {
            throw error;
        }
    },

    getTopMonth: async (page) => {
        try {
            const response = await axiosInstance.get(`/others/top_month/?page=${page}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getTopPopularToday: async () => {
        try {
            const response = await axiosInstance.get(`/others/popular_today`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getFollowing: async (page) => {
        try {
            const response = await axiosInstance.get(`/others/articles_following/?page=${page}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getArticlesByCategorySlug: async (slug, page) => {
        try {
            const response = await axiosInstance.get(`/others/articles_categories/?slug=${slug}&page=${page}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default TrangChuServices;
