var _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const sum = blogs => {
    const reducer = (sum, item) => {
        return sum + item
    }
    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const maxLikes = blogs => {
    const reducer = (max, item) => {
        return max > item ? max : item;
    }
    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const totalLikes = (blogs) => {
    return sum(blogs.map(b => b.likes))
}

const favoriteBlog = (blogs) => {
    const maxLikesOfBlogs = maxLikes(blogs.map(b => b.likes))
    return maxLikesOfBlogs == 0 ? {} : blogs.find(blog => blog.likes == maxLikesOfBlogs);
}

const mostBlogs = (blogs) => {
    const arr = _.reduce(blogs, function (result, blog) {
        const index = _.findIndex(result, (b) => b.author === blog.author);


        if (index !== -1) {
            result[index].blogs++;
        } else {
            result.push({ "author": blog.author, "blogs": 1 })
        }

        return result
    }, []);

    return arr.length === 0 ? {} : _.maxBy(arr, "blogs")
}

const mostLikes = (blogs) => {
    const arr = _.reduce(blogs, function (result, blog) {
        const index = _.findIndex(result, (b) => b.author === blog.author);


        if (index !== -1) {
            result[index].likes += blog.likes;
        } else {
            result.push({ "author": blog.author, "likes": blog.likes })
        }

        return result
    }, []);

    return arr.length === 0 ? {} : _.maxBy(arr, "likes")
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}