const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')


exports.getOverview = catchAsync (async (req, res) => {
    // 1. Get tour data from API
    const tours = await Tour.find()
    console.log(tours)
    // 2. Build template 
    // 3. Render that template using tour data form 1)
    res.status(200).render('overview', {
        title: 'This is a title',
        tours
    })
})

exports.getTour = catchAsync (async (req, res) => {
    // 1. Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        select: 'review rating user'
    })
    // 2. Build template
    // 3. Render template 
    res.status(200).render('tour', {
        title: 'This is a title',
        tour
    })
})