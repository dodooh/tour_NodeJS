const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')

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
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'success',
        message: 'this route is not defined yet'
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'success',
        message: 'this route is not defined yet'
    })
}