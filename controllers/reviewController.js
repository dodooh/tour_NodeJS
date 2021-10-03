const Review = require('../models/reviewModel')
// const catchAsync = require('../utils/catchAsync')
const { getAll, getOne, deleteOne, updateOne, createOne } = require('./handlerFactory')


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