import axios from 'axios'

const api = axios.create({
  baseURL: 'https://askpaper-ai.onrender.com/',
})

export default api