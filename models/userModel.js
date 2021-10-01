const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
// name email photo password passwordConfirm
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must be required'],
    },
    email: {
        type: String,
        required: [true, 'Email must be required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password must be required'],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password Confirm must be required'],
        validate: {
            // This only work on CREATE and SAVE!!!
            // NOT FOR UPDATE
            validator: function (el) {
                return el === this.password
            },
            message: 'The confirmation failed! Please match the password'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    // if name or email are changed but not password
    // then next() and do not thing change with password
    if (!this.isModified('password'))
        return next()
    // Hash the password with the cost of 12
    this.password = await bcrypt.hash(this.password, 12)
    // Not adding passwordConfirm into database
    this.passwordConfirm = undefined
    this.passwordChangedAt = Date.now() - 1000
    next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        console.log(changedTimestamp, JWTTimestamp)
        return JWTTimestamp < changedTimestamp // 100 < 200 : true
    }
    // false: not changed
    return false
}

userSchema.methods.createPasswordResetToken = function () {
    // Unencrypted token
    const resetToken = crypto.randomBytes(32).toString('hex')
    // Encrypted token
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    
    console.log({resetToken}, this.passwordResetToken)
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}


module.exports = mongoose.model('User', userSchema)