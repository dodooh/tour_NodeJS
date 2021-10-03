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
    deactivateProfile,
    getMe
} = require('../controllers/userController')


router.post('/signup', signup)
router.post('/login', login)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)
router.patch('/updatePassword', protect , updatePassword)

// Protect all routes after this middleware
// All route below need log in first to be execute
router.use(protect)

router.get('/me', getMe, getUser)
router.patch('/updateProfile', updateMe)// UPDATE PROFILE FOR LOGED IN USER
router.delete('/deactivateProfile', deactivateProfile)

router.use(restrictTo('admin'))
router
    .route('/')
    .get(getAllUsers)
    .post(createUser) // use log in
    
router
    .route('/:id')
    .get(getUser)
    // UPDATE PROFILE {role, mail, ...} only for ADMIN
    .patch(updateProfile)
    .delete(deleteUser)

module.exports = router