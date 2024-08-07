const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', { url:1, title:1, author:1, id:1})
    response.status(200).json(users)
  } catch (err) {
    next(err);
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body
    
    if (typeof(username) === "undefined" || typeof(password) === "undefined") {
      response.status(400).send({error: 'username or password must not be empty'})
      return;
    }
    if (username.length <3 || password.length < 3) {
      response.status(400).json({ error: 'username or password must be at least 3 characters long' })
      return;
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  
  } catch (err) {
    next(err);
  }
})
module.exports = usersRouter