const express = require('express');
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const router = express.Router();

const upload = multer({ storage });

// index route
router.get('/', catchAsync(campgrounds.index));

// create camp (form) route
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// create camp route
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCamp));

// show camp route
router.get('/:id', catchAsync(campgrounds.showCamp));

// edit camp (form) route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// edit camp route
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCamp));

// delete camp route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));

module.exports = router;