const dotenv = require('dotenv')
dotenv.config({path: './.env'})
const app = require('./app')
const mongoose = require("mongoose")

// Uncaught exception: loi khai bao bien
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION :( Shutting down...')
    console.log(err.name, err.message)
    process.exit(1)
})
// Database connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {console.log("DB Connected")})
    //.catch(error => console.log(error))

// listen port
const port = process.env.PORT || 3001
const server = app.listen(port, () => {
    console.log(`App running on port ${port}`)
})
// Unhandle Rejected Promise - Some Uncaught from Database
process.on('unhandledRejection', err => {
    console.log('UNHANDLE REJECTION: :( Shutting down...')
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})
