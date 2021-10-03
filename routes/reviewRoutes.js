const express = require('express')
const router = express.Router({ mergeParams: true  })
const {
    protect,
    restrictTo
} = require('../controllers/authController')
const {
    getAllReviews,
    getReview,
    createReview,
    deleteReview,
    updateReview,
    setTourUserIds,
} = require('../controllers/reviewController')

router.route('/')
    // GET /tour/2222czxcsd/reviews
    // POST /tour/2222czxcsd/reviews
    // POST /reviews
    .get(protect, getAllReviews)
    .post(protect, restrictTo('user'), setTourUserIds, createReview)

router.route('/:id')
    .get(getReview)
    .patch(updateReview)
    .delete(deleteReview)

module.exports = router