const express = require('express')
const {
    getOverview,
    getTour
} = require('../controllers/viewController')
const router = express.Router()


router.get('/', getOverview)
router.get('/tours/:slug', getTour)

module.exports = router