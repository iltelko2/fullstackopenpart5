const mongoose = require('mongoose')
const config = require('../utils/config')

const mongoUrl = config.MONGODB_URI

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: { type: Number, default: 0 },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

mongoose.connect(mongoUrl).then(result => {
    console.log('connected to MongoDB')
})
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

module.exports = mongoose.model('Blog', blogSchema)
