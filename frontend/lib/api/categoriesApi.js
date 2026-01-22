import apiClient from '@/lib/api'

// Categories
export const categoriesApi = {
  getAll: async () => {
    const response = await apiClient.get('/category/categories')
    return response.data
  },
}

// Subcategories
export const subcategoriesApi = {
  getAll: async () => {
    const response = await apiClient.get('/subCategory')
    return response.data
  },
}

// Products (for featured items in nav)
export const productsApi = {
  getAll: async () => {
    const response = await apiClient.get('/product')
    return response.data
  },
}
