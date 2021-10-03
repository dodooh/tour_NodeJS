const mongoose = require('mongoose')

// review: rating, createdAt, ref to tour, ref to user
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        minLength: 20,
        requried: [true, 'Review can not be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Review need a rating']
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    },
},
    {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
    }
)

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next()
})


module.exports = mongoose.model('Review', reviewSchema)