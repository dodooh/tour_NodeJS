const express = require('express')
const router = express.Router()
const {
    protect
} = require('../controllers/authController')
const {
    getAllReviews,
    createReview
} = require('../controllers/reviewController')

router.route('/')
    .get(protect, getAllReviews)
router.route('/createReview')
    .post(protect, createReview)


module.exports = router