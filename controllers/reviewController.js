const Review = require('../models/reviewModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { deleteOne, updateOne, createOne } = require('./handlerFactory')

exports.getAllReviews = catchAsync( async (req, res, next) => {
    let filterObj = {}
    if (req.params.tourId) {
        filterObj = { tour : req.params.tourId}
    }

    const reviews = await Review.find(filterObj);

    res.status(200).json({
        status: 'success',
        amount: reviews.length,
        reviews
    })
})

exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user._id
    next()
}

exports.createReview = createOne(Review)
exports.updateReview = updateOne(Review)
exports.deleteReview = deleteOne(Review)