const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const { getAll, getOne, deleteOne, updateOne} = require('./handlerFactory')


exports.getUser = getOne(User)
exports.getAllUsers = getAll(User)
exports.updateProfile = updateOne(User)
exports.deleteUser = deleteOne(User)

exports.createUser = (req, res) => {
    // use log in
    res.status(400).json({
        status: 'fail',
        message: 'please use /login'
    });
}

const filterObj = (body, ...params) => {
    const newObj = {}
    Object.keys(body).forEach(el => {
        if (params.includes(el)) {
            newObj[el] = body[el]
        }
    })
    return newObj
}
exports.getMe = (req, res, next) => {
    req.params.id = req.user._id
    next()
}
// Update loged in User
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }
  
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
  
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  });
// DO NOT update password with this
// deactivate account - for log in user
exports.deactivateProfile = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {active: false} )

    res.status(200).json({
        status: 'success',
        message: 'delete successfully'
    })
})
// delete account from database, for administrator