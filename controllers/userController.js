const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')

const filterObj = (body, ...params) => {
    const newObj = {}
    Object.keys(body).forEach(el => {
        if (params.includes(el)) {
            newObj[el] = body[el]
        }
    })
    return newObj
}


exports.checkId = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`)
    if (val * 1 > tours.length) { 
        return res.status(400).json({
                status: 'fail',
                message: 'Invalid ID'
            })
    }
    req.id = val
    next()
}
exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();
  
    res.status(200).json({
        status: 'success',
        result: users.length,
        data: {
            users
        }
    });
})
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'success',
        message: 'this route is not defined yet'
    })
}
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'success',
        message: 'this route is not defined yet'
    })
}
exports.updateProfile = catchAsync( async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next( new AppError('Password change is permitted! Go to /updatePassword', 400))
    }
    const filteredObject = filterObj(req.body, 'name', 'email')
    const user = await User.findByIdAndUpdate(req.user._id, filteredObject , {new: true, runValidator: true})
    res.status(200).json({
        status: 'success',
        user
    })
})
exports.deleteProfile = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {active: false} )

    res.status(200).json({
        status: 'success',
        message: 'delete successfully'
    })
})