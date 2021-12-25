const express = require('express');
const router = express.Router({ mergeParams: true });
const campgroundLogic = require('../controllers/campgrounds')
const {isLoggedIn, isOwner, isExist, isCleanData} = require('../middleware');
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage: storage})
router.route('/')
.get(campgroundLogic.campgrounds )
.post(isLoggedIn,  upload.array('image'), isCleanData, campgroundLogic.makeNewCampground )

router.get('/new', isLoggedIn,campgroundLogic.newCampgroundFrom )

router.get('/:id/edit', isExist, isLoggedIn, isOwner, campgroundLogic.editCampgroundForm )

router.route('/:id')
.get( isExist, campgroundLogic.showCampground)
.put(isExist, isLoggedIn, isOwner, upload.array('image'), isCleanData, campgroundLogic.editCampground)
.delete( isExist, isLoggedIn, isOwner, campgroundLogic.deleteCampground)

module.exports = router;