const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { getAll, getOne, deleteOne, updateOne, createOne } = require('./handlerFactory')

// Return Error if User update/delete someone else's review
exports.didPostedThis = catchAsync(async (req, res, next) => {
    console.log(req.user)
    if (req.user.role === 'admin') {
        return next() 
    }
    console.log('02')
    const review = await Review.findById(req.params.id)
    console.log(review.user._id, req.user._id)
    if (!review) {
        return next(new AppError('Not found this review', 400))
    }
    console.log('03')
    if (!(review.user._id === req.user._id)) {
        return next(new AppError('You can not modify this review! This review belongs into someone else! Try again', 400))
    }
    console.log('04')
    next()
})

exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user._id
    next()
}
exports.getAllReviews = getAll(Review)
exports.getReview = getOne(Review)
exports.createReview = createOne(Review)
exports.updateReview = updateOne(Review)
exports.deleteReview = deleteOne(Review)