const express = require('express')
const { signup, login } = require('../controllers/authController')
const router = express.Router()
const {
    getUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    checkId
} = require('../controllers/userController')


router.post('/signup', signup)
router.post('/login', login)

router
    .route('/')
    .get(getAllUsers)
    .post(createUser)
router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router