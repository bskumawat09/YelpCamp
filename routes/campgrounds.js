const express = require('express');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { campSchema } = require('../schemas.js');
const isLoggedIn = require('../middleware');

const router = express.Router();

// campground schema validation middleware (server-side) with joi
const validateCampground = (req, res, next) => {
    const { error } = campSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// index route
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds });
}));

// add new (form) route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new.ejs');
});

// add new route
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const newCamp = await Campground(req.body.campground);
    await newCamp.save();
    req.flash('success', 'Successfully added new campground');
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

// show details route
router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    if (!camp) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs', { camp });
}));

// edit (form) route
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { camp });
}));

// edit route
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${camp._id}`);
}));

// delete route
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}));

module.exports = router;