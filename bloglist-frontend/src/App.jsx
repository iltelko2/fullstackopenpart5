import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import CreateNewBlog from './components/CreateNewBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  
  const [errorMessage, setErrorMessage] = useState('') 
  const [error, setError] = useState(false) 

  const blogFormRef = useRef()

  const ErrorMessage = () => {
    return (<div style={{ border: '1px solid ' + error ? 'red' : 'green', color: error ? 'red' : 'green' }}>
{errorMessage}
    </div>)
  }

  const Logout = () => {
    return (<div>
      <button type="button" onClick={() => {
        window.localStorage.removeItem('user')
        setUser(null)
        blogService.setToken(null)
      }}>Logout</button>
    </div>)
  }

  const Blogs = () => {
    return (
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>)
  }

  const CreateBlog = async ({ title, author, url }) => {
    blogFormRef.current.toggleVisibility()
          
    await blogService.createBlog({ title, author, url }) 
    
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }

  const Login = () => {
    return (<><h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
      </>
      )
  }
  
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      window.localStorage.setItem('user', JSON.stringify(user))

      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )

    } catch (exception) {
      setError(true)
      setErrorMessage('wrong credentials')

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  useEffect(() => {
    if (!user && window.localStorage.getItem('user')) {
      const user = JSON.parse(window.localStorage.getItem('user'))
      setUser(user)
      blogService.setToken(user.token)
    }
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    if (!user && window.localStorage.getItem('user')) {
      const user = JSON.parse(window.localStorage.getItem('user'))
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [blogs])
  return (<>
    {errorMessage && ErrorMessage()}
    {!user && Login()} 
    {user && <div>
      <Logout></Logout>
      <Togglable buttonLabel='Create new' ref={blogFormRef}>
        <CreateNewBlog setError={setError} setErrorMessage={setErrorMessage} CreateBlog={CreateBlog} />
      </Togglable>
       <p>{user.name} logged in</p>
         {Blogs()}
      </div>
    } 
  </>
  )
}

export default App