const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campSchema } = require('./schemas.js');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// set the EJS rendering engine to ejsMate instead of default one
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// schema validation (server-side) with joi
const validateCampground = (req, res, next) => {
    const { error } = campSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// home route
app.get('/', (req, res) => {
    res.render('home.ejs');
});

// index route
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds });
}));

// add new (form) route
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new.ejs');
});

// add new route
app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    const newCamp = await Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

// show details route
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/show.ejs', { camp });
}));

// edit (form) route
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { camp });
}));

// edit route
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${camp._id}`);
}));

// delete route
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

// for all the other routes
app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found!", 404));
});

// custom error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render('error.ejs', { err });
});

app.listen(3000, (req, res) => {
    console.log('Serving on port 3000');
});