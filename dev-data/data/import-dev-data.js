const mongoose = require('mongoose')
const fs = require('fs')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')
const User = require('../../models/userModel')
const Review = require('../../models/reviewModel')
dotenv.config({ path: './.env' })

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {console.log("DB Connected")})
    .catch(error => console.log(error));

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours.json', 'utf-8'))
const users = JSON.parse(fs.readFileSync('./dev-data/data/users.json', 'utf-8'))
const reviews = JSON.parse(fs.readFileSync('./dev-data/data/reviews.json', 'utf-8'))

// import data to database

const importData = async () => {
    try {
        await Tour.create(tours)
        await Review.create(reviews)
        await User.create(users, { validateBeforeSave: false})
        console.log('Data successfully loaded')
        process.exit()
    } catch (err) {
        console.log(err)
        process.exit()
    }
}

// delete all data from collection

const deleteData = async () => {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('Data successfully deleted')
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData()
}

