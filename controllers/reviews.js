const Review = require('../schema/review')
const CampGround = require('../schema/campground');
module.exports.makeNewReview = async ( req, res, next)=>{
    try{
        const campground = await CampGround.findById(req.params.id)
        const {rating, content} = req.body
        const review = await new Review({rating, content})
        review.owner = req.user._id;
        campground.reviews.push(review)
        review.belong_campground = campground
        await campground.save()
        await review.save()
        req.flash('success', 'Successfully posted new review.')
        res.redirect(`/campgrounds/${campground._id}`)
    }
    catch(error){
        req.flash('error', error.message)
        res.redirect(`/campgrounds/${campground._id}`)
    }
        
}
module.exports.deleteReview =  async (req, res) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}