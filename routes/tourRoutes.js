const express = require('express')
const router = express.Router()
const {
    getAllTours,
    getTour,
    updateTour,
    createTour,
    deleteTour,
    aliasTopTour,
    getTourStats,
    getMonthlyPlan
} = require('../controllers/tourController')
const { protect, restrictTo } = require('../controllers/authController')
const reviewRoutes = require('./reviewRoutes')

router.route('/top-5-cheap').get(aliasTopTour, getAllTours)
router.route('/tours-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(
    protect,
    restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
)

router.use('/:tourId/reviews', reviewRoutes)

router
    .route('/')
    .get(getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createTour)

router
    .route('/:id')
    .get(getTour)
    .patch(
        protect,
        restrictTo('admin', 'lead-guide'),
        updateTour
    )
    .delete(
        protect,
        restrictTo('admin', 'lead-guide'),
        deleteTour
    )

module.exports = router