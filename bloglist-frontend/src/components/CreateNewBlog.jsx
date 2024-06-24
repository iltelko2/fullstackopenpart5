import { useState } from 'react'

const CreateNew = ({ setError, setErrorMessage, CreateBlog }) => {

const [title, setTitle] = useState('') 
const [author, setAuthor] = useState('') 
const [url, setUrl] = useState('') 

const addBlog = async () => { 
    await CreateBlog({ title, author, url })
    
    setError(false)
    setErrorMessage(title + ' created')
    setTimeout(() => {
        setErrorMessage(null)
    }, 5000)
    setTitle('')
    setAuthor('')
    setUrl('')
}

return (
    <div>
    <h2>Create New</h2>
    <form onSubmit={addBlog}>
    Title: <input type="text" value={title} onChange={({ target }) => setTitle(target.value)}></input><br></br>
    Author: <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)}></input><br></br>
    URL: <input type="text" value={url} onChange={({ target }) => setUrl(target.value)}></input><br></br>
    <button type="submit">Create</button>
    </form>
    </div>
)
}

export default CreateNew
