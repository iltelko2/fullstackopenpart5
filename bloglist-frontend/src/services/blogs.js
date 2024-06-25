import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {

  const config = {
    headers: { Authorization: token },
  }

  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const createBlog = (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.post(baseUrl, newBlog, config)
  return request.then(response => response.data)
}

const updateBlog = (id, blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.put(baseUrl + '/' + id, blog, config)
  return request.then(response => response.data)
}

const deleteBlog = (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.delete(baseUrl + '/' + id, config)
  return request.then(response => response.data)
}

export default { getAll, setToken, createBlog, updateBlog, deleteBlog }
