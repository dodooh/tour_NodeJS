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
    // checkId,
    // checkBody
} = require('../controllers/tourController')
const { protect, restrictTo } = require('../controllers/authController')
const reviewRoutes = require('./reviewRoutes')
// router.param('id', checkId)

// As soon as someone route to /top-5-cheap
// middleware call to fix the req.query [limit,sort,fields]
// then revoke getAllTours  
router.route('/top-5-cheap').get(aliasTopTour, getAllTours)
router.route('/tours-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

router.use('/:tourId/reviews', reviewRoutes)

router
    .route('/')
    .get(protect ,getAllTours)
    .post(protect,restrictTo('admin', 'lead-guide'), createTour)

router
    .route('/:id')
    .get(getTour)
    .patch(protect,
        restrictTo('admin', 'lead-guide'),updateTour)
    .delete(
        protect,
        restrictTo('admin', 'lead-guide'),
        deleteTour)

module.exports = router