import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('') 
 
  const [errorMessage, setErrorMessage] = useState('') 
  const [error, setError] = useState(false) 

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

  const CreateNew = () => {
    return (
      <div>
        <h2>Create New</h2>
        Title: <input type="text" value={title} onChange={({ target }) => setTitle(target.value)}></input><br></br>
        Author: <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)}></input><br></br>
        URL: <input type="text" value={url} onChange={({ target }) => setUrl(target.value)}></input><br></br>
        <button type="button" onClick={async () => { await blogService.createBlog({ title, author, url }) 
      setTitle('')
      setAuthor('')
      setUrl('')

      setError(false)
      setErrorMessage(title + ' created')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
      }}>Create</button>
      </div>
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
      {CreateNew()}
       <p>{user.name} logged in</p>
         {Blogs()}
      </div>
    } 
  </>
  )
}

export default App