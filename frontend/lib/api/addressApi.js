import apiClient from '../api'

export const addressApi = {
  create: async (addressData) => {
    const response = await apiClient.post('/address', addressData)
    return response.data
  },

  getAll: async () => {
    const response = await apiClient.get('/address/get-all')
    return response.data
  },

  update: async (id, addressData) => {
    const response = await apiClient.put(`/address/${id}`, addressData)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/address/${id}`)
    return response.data
  },
}
