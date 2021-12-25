const express = require('express');
const router = express.Router({mergeParams: true});
const {isLoggedInForReview, isOwnerForReview, isExistForReview, isCleanData} = require('../middleware');
const reviewLogic = require('../controllers/reviews')

router.post('/reviews', isLoggedInForReview, isCleanData, reviewLogic.makeNewReview)
router.delete('/reviews/:reviewId',isExistForReview, isLoggedInForReview, isOwnerForReview, reviewLogic.deleteReview)
module.exports = router;