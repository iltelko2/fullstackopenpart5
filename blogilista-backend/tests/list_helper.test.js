import { test, describe, expect } from 'vitest'
import { afterAll, beforeAll, beforeEach, afterEach } from 'vitest'

const listHelper = require('../utils/list_helper')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')

const api = supertest(app)

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    const emptyList = [];

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(emptyList)
        expect(result).toBe(0)
    })

    test('of bigger list is calculated right', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })


})

describe('favoriteBlog', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog equals the only blog object', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result._id).toBe('5a422aa71b54a676234d17f8')
    })

    test('when list has many blog equals the blog with most votes', () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result._id).toBe('5a422b3a1b54a676234d17f9')
    })

    test('when list has not any blog equals empty object', () => {
        const result = listHelper.favoriteBlog([])
        expect(Object.keys(result).length).toBe(0)
    })
})

describe('mostBlogs', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog equals the only blog/author object', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result.author).toBe('Edsger W. Dijkstra')
    })

    test('when list has many blog equals the author with most blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result.author).toBe('Robert C. Martin')
    })

    test('when list has not any blog equals empty object', () => {
        const result = listHelper.mostBlogs([])
        expect(Object.keys(result).length).toBe(0)
    })
})

describe('mostLikes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog equals the only blog/author object', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result.author).toBe('Edsger W. Dijkstra')
    })

    test('when list has many blog equals the author with most likes', () => {
        const result = listHelper.mostLikes(blogs)
        expect(result.author).toBe('Edsger W. Dijkstra')
    })

    test('when list has not any blog equals empty object', () => {
        const result = listHelper.mostLikes([])
        expect(Object.keys(result).length).toBe(0)
    })
})

let token = null

beforeAll(async () => {
    for (let i = 0; i < blogs.length; i++) {
        const filter = { title: blogs[i].title }
        await Blog.findOneAndUpdate(
            filter,
            blogs[i],
            {
                upsert: true
            })
    }

    const filter = { author: 'Ilkka Korhonen' }
    await Blog.deleteMany(filter)

})

beforeEach(() => {

})
  
afterEach(() => {
})
  
afterAll(async () => {
    await mongoose.connection.close()
  })

describe('post new blogs', () => {
    beforeAll(async () => {    
        const newUser = {
            username: 'iltelko',
            name: 'Ilkka Korhonen',
            password: 'salainen2',
        }
    
        await api
            .post('/api/users')
            .send(newUser)

            const newLogin = {
                username: 'iltelko',
                password: 'salainen2',
            }
            
            const response = await api
              .post('/api/login')
              .send(newLogin)
            
            token = response.body.token
    })

    test('Count of all the blogs is correct', async () => {
        const response = await (await api.get('/api/blogs').auth(token, { type: 'bearer' }))
        
        expect(response.body).toHaveLength(6)
    })
    
    test('Api returnds object with id field defined', async () => {
        const response = await (await api.get('/api/blogs').auth(token, { type: 'bearer' }))
        
        expect(response.body[0].id).toBeDefined()
    })

    test('Post new blog without likes, adds likes with 0', async () => {
        const newBlog = {
            _id: new mongoose.Types.ObjectId(),
            title: "Oma kirja",
            author: 'Ilkka Korhonen',
            url: "https://reactpatterns.com/",
            __v: 0
        }
    
        console.log(`token: ${token}`)
    
        const resp = await api.post('/api/blogs')
        .auth(token, { type: 'bearer' })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        // sometimes there are delay in posting the blog into the database, this delay makes sure that Blog.find is called after inserting
        await new Promise(r => setTimeout(r, 500));
    
        const blogInDb = await Blog.findOne({_id: newBlog._id})
    
        expect(blogInDb.likes).toEqual(0)
    
        await api.delete('/api/blogs/' + newBlog._id).auth(token, { type: 'bearer' })
    })
    
    test('Count of all the blogs is correct after adding one', async () => {
        const filter = { }
        const blogsInDb = await Blog.find(filter)
    
        const newBlog = {
            _id: new mongoose.Types.ObjectId(),
            title: "Oma kirja",
            author: 'Ilkka Korhonen',
            url: "https://reactpatterns.com/", 
            likes: 17,
            __v: 0
        }

        const resp = await api.post('/api/blogs')
        .auth(token, { type: 'bearer' })
        .send(newBlog)
        .expect(201)
                .expect('Content-Type', /application\/json/)
    
        // sometimes there are delay in posting the blog into the database, this delay makes sure that Blog.find is called after inserting
        await new Promise(r => setTimeout(r, 500));
    
        const blogsInDbAfter = await Blog.find(filter)
        expect(blogsInDbAfter).toHaveLength(blogsInDb.length + 1)
    
        await api.delete('/api/blogs/' + newBlog._id).auth(token, { type: 'bearer' })
    })
    

test('Post new blog without title, response 400', async () => {
    const newBlog = {
        _id: new mongoose.Types.ObjectId(),
        author: 'Ilkka Korhonen',
        url: "https://reactpatterns.com/",
        __v: 0
    }

    const resp = await api.post('/api/blogs').auth(token, { type: 'bearer' })
    .send(newBlog)
    .expect(400)
})

test('Post new blog without url, response 400', async () => {
    const newBlog = {
        _id: new mongoose.Types.ObjectId(),
        title: 'ergaerg',
        author: 'Ilkka Korhonen',
        __v: 0
    }

    const resp = await api.post('/api/blogs').auth(token, { type: 'bearer' })
    .send(newBlog)
    .expect(400)
})

test('Put existing blog with changes, response 200', async () => {
    let newBlog = JSON.parse(JSON.stringify(blogs[0]))
    newBlog.author = 'Ilkka Korhonen'

    const resp = await api.put('/api/blogs/' + newBlog._id).auth(token, { type: 'bearer' })
    .send(newBlog)
    .expect(200)
})
})
