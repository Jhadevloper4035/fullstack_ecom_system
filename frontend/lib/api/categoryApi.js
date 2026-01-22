import apiClient from '../api'

export const categoryApi = {

  getAll: async () => {
    const response = await apiClient.get('/category/get-all')
    return response.data
  },
}
