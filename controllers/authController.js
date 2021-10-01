const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')
const { promisify } = require('util')
const crypto = require('crypto')

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

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide'], role='user'
        // check if user.role is restricted or not
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        }

        next()
    }
}

exports.forgotPassword = catchAsync( async (req, res , next) => {
    // 1. Get user based on POSTed email
    const user = await User.findOne({email: req.body.email})
    if (!user) {
        return next( new AppError('There is no user with email address', 404))
    }
    // 2. Generate the random reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false})
    // 3. Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`
    console.log(resetURL)
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n
    If you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
          });
      
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({validateBeforeSave: false})

        return next( new AppError('There was an error sending the email. Try again later', 500))

    }
    
})


exports.resetPassword = catchAsync( async (req, res, next) => {
    // 1. get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
                $gt: Date.now()
            }
    })

    // 2. if token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Invalid Token or Expires', 401))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    // 3. update changePasswordAt property for user
 
    // 4. log the user in, send JWT
    const token = signToken(user._id)
    
    res.status(201).json({
        status: 'success',
        token
    })
})