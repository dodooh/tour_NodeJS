const Review = require('../models/reviewModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')


exports.getAllReviews = catchAsync( async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        amount: reviews.length,
        reviews
    })
})

exports.createReview = catchAsync(async (req, res, next) => {
    let review = req.body
    review.user = req.user._id
    review = await Review.create(review)
    res.status(201).json({
        status: "success",
        data: {
            review
        }
    })
})