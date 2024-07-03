import { test, describe, expect } from 'vitest'
import { afterAll, beforeAll, beforeEach, afterEach } from 'vitest'

const bcrypt = require('bcrypt')
const User = require('../models/user')

const { usersInDb } = require('../utils/test_helper')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd.length).toStrictEqual(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with a wrong kind of username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'ml',
      name: 'Matti Luukkainen2',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('creation fails with an empty password', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'ml',
      name: 'Matti Luukkainen2',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      expect(response.body?.error).toContain('username or password must not be empty')
  })

  test('username must be unique', async () => {
    const newUser = {
      username: 'ml2',
      name: 'Matti Luukkainen2',
      password: 'salainen',
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
    const response2 = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    expect(response2.body?.error).toContain('expected `username` to be unique')
  })
})

describe('token authentication requests', () => {
  beforeAll(async () => {

    const newUser = {
      username: 'iltelko',
      name: 'Ilkka Korhonen',
      password: 'salainen2',
    }

    await api
      .post('/api/users')
      .send(newUser)
      
  })

  test('login is successful', async () => {
    const newLogin = {
      username: 'iltelko',
      password: 'salainen2',
    }

    const response = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)
  })
})
