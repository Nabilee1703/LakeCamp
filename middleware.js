const CampGround = require('./schema/campground');
const Review = require('./schema/review');
const sanitizeHtml = require('sanitize-html');
module.exports.isCleanData = async (req, res, next) => {
    try {
        const text = sanitizeHtml(JSON.stringify(req.body), {
            allowedTags: [],
            allowedAttributes: {}
        })
        req.body = JSON.parse(text)
        next()
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/campgrounds')
    }
}
module.exports.isExist = async (req, res, next) => {
    try {
        const { id } = req.params
        const campground = await CampGround.findById(id)
        if (campground === null) throw new Error()
        else next()
    } catch (error) {
        req.flash('error', 'Campground does not exist!')
        res.redirect('/campgrounds')
    }
}
module.exports.isExistForReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const review = await Review.findById(reviewId)
        if (review === null) throw new Error()
        else next()
    } catch (error) {
        const { id } = req.params
        req.flash('error', 'Review does not exist!')
        res.redirect(`/campgrounds/${id}`)
    }
}
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.currentUrl = req.originalUrl;
        req.flash('error', 'You must be logged in first')
        return res.redirect('/login')
    }
    next()
}
module.exports.isLoggedInForReview = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.currentUrl = `/campgrounds/${req.params.id}`;
        req.flash('error', 'You must be logged in first')
        return res.redirect('/login')
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params
    const campground = await CampGround.findById(id)
    if (!campground.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do this!')
        res.redirect(`/campgrounds/${id}`)
    }
    next()
}
module.exports.isOwnerForReview = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do this!')
        res.redirect(`/campgrounds/${id}`)
    }
    next()
}