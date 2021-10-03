const mongoose = require('mongoose')
// const User = require('./userModel')
const slugify = require('slugify')
const validator = require('validator')
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        minlength: [10, 'A name must have at least 10 characters'],
        maxlength: [40, 'A name must have at most 40 characters'],
        unique: true,
        trim: true,
        // validate: [validator.isAlpha, 'Tour name must only contain Characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: "Difficulty is either: easy, medium, difficult"
        }
    },
    ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must between 1 and 5'],
        max: [5, 'Rating must between 1 and 5']
    },
    ratingQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // 'this' in this case only apply on CREATE new document
                // NOT FOR UPDATE
                return val < this.price // 100 < 200 true
                // 250 < 200 false => handle error
            },
            message: 'Discount price ({VALUE}) should be below regular price',
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false// never appear in client response
    },
    startDates: [Date],
    secretTour: { // True: secret , False: not secret
        type: Boolean,
        default: false
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
// Can't not select durationWeeks in query
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7  
})
// virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review', // reference to Review Document
    foreignField: 'tour', // find all field tour
    localField: '_id' // with match _id with tour._id
})
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// NOT FOR UPDATE

tourSchema.pre('save', function (next) {
   // 'this' is the currently process document that on .save() || .create()
   // console.log(this)
    this.slug = slugify(this.name, { lower: true })
    next()
    
})
// EMBEDED Tour - User
// tourSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map( async id => await User.findById(id))
//     this.guides = await Promise.all(guidesPromises)
//     next()
// })

// QUERY MIDDLEWARE: 
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true }})
    this.start = Date.now()
    next()     
})

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query find took ${Date.now() - this.start} milisecond`)
    // console.log(docs)
    next()     
})

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: { secretTour: {$ne: true}}
    })
    next()

})
module.exports = mongoose.model('Tour', tourSchema)