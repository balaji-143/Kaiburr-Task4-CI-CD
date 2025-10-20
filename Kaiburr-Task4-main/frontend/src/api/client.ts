import axios from 'axios'

export const api = axios.create({
  baseURL: '/',
  timeout: 10000
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.message) {
      error.message = error.response.data.message
    }
    return Promise.reject(error)
  }
)
