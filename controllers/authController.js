const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const { promisify } = require('util')
const signToken = id => {
    return jwt.sign(
                    { id },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN }
                )
}

exports.signup = catchAsync(async (req, res, next) => {
    // Prevent user setting 'role' to admin by add 'role' to the body
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    })

    const token = signToken(newUser._id)
    
    
    
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync( async (req, res, next) => {
    const {email, password} = req.body

    //1. check if email and password exist
    if (!email || !password) {
        return next( new AppError('Please provide email and password!', 400))
    }
    //2. check if user exists and the password is correct
    const user = await User.findOne({ email }).select('+password')
    // const correct = await user.correctPassword(password, user.password)

    if (!user || !await user.correctPassword(password, user.password)) {
        return next( new AppError('Incorrect email or password', 401))
    }
    //3. if everything is OK, send token to client
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.protect = catchAsync(async (req, res, next) => {

    // 1. getting token and check if it exist
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        console.log(token)
    }
    
    if (!token) {
        return next( new AppError('You are not log in. Please log in to get access', 401))
    }
    // 2. verification token
    // promisify is make verify() return a promise
    // keep the promise pattern all the time
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // 3. check if user still exists
    const freshUser = await User.findById(decoded.id)
    if (!freshUser) {
        return next( new AppError('The user belonging to this token is no longer exists.', 401))
    }
    // 4. check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again', 401))
    }
    // 5. next without any error
    // Grant Access to Protected Route
    req.user = freshUser
    next()
})