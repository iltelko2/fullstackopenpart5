const express = require('express')
const app = express()
const logger = require('./utils/logger')
const cors = require('cors')

const config = require('./utils/config')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)

const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
const usersRouter = require('./controllers/users')
app.use('/api/users', usersRouter)
const loginRouter = require('./controllers/login')
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app