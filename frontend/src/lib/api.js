import axios from 'axios'

const api = axios.create({
  baseURL: 'https://askpaper-ai.onrender.com/',
  timeout: 30000,
})

export default api