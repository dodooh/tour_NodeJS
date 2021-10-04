const mongoose = require('mongoose')
const Tour = require('./tourModel')
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

reviewSchema.index({tour: 1, user: 1}, {unique: true})

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next()
})

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                aveRating: { $avg: '$rating'}
            }
        }
    ])

    console.log(stats)
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingAverage: stats[0].aveRating,
            ratingQuantity: stats[0].nRating
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingAverage: 4.5, 
            ratingQuantity: 0
        })
    }
}

reviewSchema.post('save', function () {
    // this point to the current review
    // this.constructor = Review
    this.constructor.calcAverageRatings(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
    // save review as r as a properties in "this"
    this.r = await this.findOne()
    console.log(this.r)
    next()
})

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRatings(this.r.tour)  
})
module.exports = mongoose.model('Review', reviewSchema)