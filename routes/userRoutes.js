const express = require('express')
const {
    signup,
    protect,
    restrictTo,
    login,
    forgotPassword,
    resetPassword,
    updatePassword
} = require('../controllers/authController')

const router = express.Router()
const {
    getUser,
    getAllUsers,
    createUser,
    deleteUser,
    updateProfile,
    updateMe,
    deactivateProfile
} = require('../controllers/userController')


router.post('/signup', signup)
router.post('/login', login)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)
router.patch('/updatePassword', protect , updatePassword)
// UPDATE PROFILE FOR LOGED IN USER
router.patch('/updateProfile', protect, updateMe)

router.delete('/deactivateProfile',protect, deactivateProfile)
router
    .route('/')
    .get(getAllUsers)
    .post(createUser)
    
router
    .route('/:id')
    .get(getUser)
    // UPDATE PROFILE {role, mail, ...} only for ADMIN
    .patch(protect, restrictTo('admin'), updateProfile)
    .delete(deleteUser)

module.exports = router