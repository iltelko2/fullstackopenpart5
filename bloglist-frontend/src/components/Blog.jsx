import Hidable from './Hidable'
import { useState } from 'react'

const Blog = ({ blog, likeBlogInner, removeBlogInner }) => {

  const [likes, setLikes] = useState(blog.likes)

  const likeBlog = () => {
    blog.likes++
    likeBlogInner(blog.id, { _id: blog.id, user: blog.user.id, likes: blog.likes, author: blog.author, title: blog.title, url: blog.url })

    setLikes(blog.likes)
  }

  const removeBlog = () => {
    removeBlogInner(blog.id)
  }

  return (<Hidable title={blog.title + ' ' + blog.author}>
    <p>likes {likes} <button onClick={likeBlog}>like</button></p>
    <p>{blog.url}</p>
    <p>{blog.user.name}</p>
    <button onClick={removeBlog}>remove</button>
  </Hidable>)
}

export default Blog