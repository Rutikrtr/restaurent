import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = 'http://localhost:8000/api/v1/user';

const menuApi = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Cookies.get('accessToken')}`
  }
});

export const menuService = {
  getRestaurantData: async () => {
    const response = await menuApi.get('/manager');
    return response.data.data;
  },

  addMenuItem: async (itemData) => {
    const response = await menuApi.post('/menu', itemData);
    return response.data;
  },

  updateMenuItem: async (itemId, itemData) => {
    const response = await menuApi.put(`/menu/${itemId}`, itemData);
    return response.data;
  },

  deleteMenuItem: async (itemId) => {
    console.log(itemId)
    const response = await menuApi.delete(`/menu/${itemId}`);
    return response.data;
  },

  addCategory: async (categoryName) => {
    const response = await menuApi.post('/menu/category', { category : categoryName });
    return response.data;
  },

  /** ❌ Delete Category */
  deleteCategory: async (categoryName) => {
    console.log(categoryName)
    const response = await menuApi.delete(`/menu/category/${categoryName}`);
    return response.data;
  }
};