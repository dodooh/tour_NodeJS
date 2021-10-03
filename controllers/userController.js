const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const { deleteOne, updateOne, createOne} = require('./handlerFactory')

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
// DO NOT update password with this
exports.updateProfile = updateOne(User)
// deactivate account - for log in user
exports.deactivateProfile = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {active: false} )

    res.status(200).json({
        status: 'success',
        message: 'delete successfully'
    })
})
// delete account from database, for administrator
exports.deleteUser = deleteOne(User)