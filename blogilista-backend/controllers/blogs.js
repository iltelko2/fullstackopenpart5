const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('', async (request, response, next) => {
    try {
        //Blog.find({ "user": request.user._id.toString()})
        const blogs = await Blog.find({}).populate('user', { "name": 1, "username": 1, "id": 1})
        
        response.json(blogs)
    } catch (err) {
        next(err);
    }
})

blogsRouter.post('', async (request, response, next) => {
    try {
        const body = request.body
        const blog = new Blog(request.body)

        if (typeof(blog.title) === "undefined" || typeof(blog.url) === "undefined") {
            response.status(400).send()
            return;
        }

        blog.user = request.user._id.toString()

        const newBlog = await blog.save()

        request.user.blogs = request.user.blogs.concat(newBlog._id)
        await request.user.save()

        response.status(201).json(newBlog)
    } catch (err) {
        console.log(err)
        next(err);
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    try {
        const blog = new Blog(request.body)

        if (typeof(blog.title) === "undefined" || typeof(blog.url) === "undefined") {
            response.status(400).send()
            return;
        }

        const newBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

        response.json(newBlog)
    } catch (err) {
        next(err);
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)

        if(blog.user.toString() === request.user.id.toString()) {
            Blog.findByIdAndDelete(request.params.id)
            .then(() => {
                response.status(204).end()
            })
        } else {
            return response.status(401).end()
        }

    } catch (err) {
        next(err);
    }
  })

module.exports = blogsRouter