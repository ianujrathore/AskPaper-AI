import axios from 'axios'

const api = axios.create({
  baseURL: 'https://anujrathore-askpaper-ai.hf.space',
  timeout: 30000,
})

export default api