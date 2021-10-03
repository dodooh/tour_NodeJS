const express = require('express')
const { signup,protect, login, forgotPassword, resetPassword,updatePassword } = require('../controllers/authController')

const router = express.Router()
const {
    getUser,
    getAllUsers,
    createUser,
    deleteUser,
    checkId,
    updateProfile,
    deactivateProfile
} = require('../controllers/userController')


router.post('/signup', signup)
router.post('/login', login)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)
router.patch('/updatePassword', protect , updatePassword)
router.patch('/updateProfile', protect, updateProfile)


router.delete('/deactivateProfile',protect, deactivateProfile)
router
    .route('/')
    .get(getAllUsers)
    .post(createUser)
    
router
    .route('/:id')
    .get(getUser)
    .patch(protect, updateProfile)
    .delete(deleteUser)

module.exports = router