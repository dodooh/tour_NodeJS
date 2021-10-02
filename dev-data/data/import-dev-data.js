const mongoose = require('mongoose')
const fs = require('fs')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')
dotenv.config({ path: './.env' })

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {console.log("DB Connected")})
    .catch(error => console.log(error));

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours.json', 'utf-8'))

// import data to database

const importData = async () => {
    try {
        await Tour.create(tours)
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

