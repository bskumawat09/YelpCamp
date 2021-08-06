const express = require('express');
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');

const router = express.Router({ mergeParams: true });

// create review route
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// delete review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;