const express = require('express');
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const router = express.Router();

// index route
router.get('/', catchAsync(campgrounds.index));

// create camp (form) route
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// create camp route
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCamp));

// show camp route
router.get('/:id', catchAsync(campgrounds.showCamp));

// edit camp (form) route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// edit camp route
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCamp));

// delete camp route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));

module.exports = router;