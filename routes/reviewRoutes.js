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
    didPostedThis
} = require('../controllers/reviewController')

router.use(protect)

router.route('/')
    // GET /tour/2222czxcsd/reviews
    // POST /tour/2222czxcsd/reviews
    // POST /reviews
    .get( getAllReviews)
    .post( restrictTo('user'), setTourUserIds, createReview)

router.route('/:id')
    .get(getReview)
    .patch(restrictTo('user', 'admin'), didPostedThis, updateReview)
    .delete(restrictTo('user', 'admin'), didPostedThis, deleteReview)

module.exports = router