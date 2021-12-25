const CampGround = require('../schema/campground');
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN
const geocoder =  mbxGeocoding({ accessToken: MAPBOX_TOKEN });
const sanitizeHtml = require('sanitize-html');

module.exports.campgrounds = async (req, res)=>{
    try {
        const campgrounds = await CampGround.find({})
        res.render('campgrounds', {campgrounds})
    } catch (error) {
        res.render('error', {error})
    }
     
}
module.exports.newCampgroundFrom = async (req, res)=>{  
    res.render('new')
}
module.exports.makeNewCampground = async (req, res, next)=>{
    try {
        const geoData = await geocoder.forwardGeocode({
             query: req.body.location,
                limit: 1
            }).send()
        
        const campground = await new CampGround(req.body)
        campground.geometry = geoData.body.features[0].geometry;
        campground.owner = req.user._id;
        campground.images =  req.files.map(f =>({path: f.path, filename: f.filename}))
        
        await campground.save()
        req.flash('success', 'Successfully made new campground.')
        res.redirect('/campgrounds')
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/campgrounds')
    }
    
}
module.exports.editCampgroundForm = async (req, res)=>{
    const {id} = req.params
    const campground = await CampGround.findById(id)
    res.render('edit', {campground})

}
module.exports.editCampground = async (req, res, next)=>{
    const {id} = req.params
   const campground = await CampGround.findByIdAndUpdate(id, req.body, {runValidators: true})
   if(req.body.deleteImage){
       for (let filename of req.body.deleteImage) {
         await cloudinary.uploader.destroy(filename)   
       }
    await  campground.updateOne({$pull:{images: {filename: {$in: req.body.deleteImage}}}})
}
const geoData = await geocoder.forwardGeocode({
    query: req.body.location,
       limit: 1
   }).send()
campground.geometry = geoData.body.features[0].geometry;
   const imgs = req.files.map(f =>({path: f.path, filename: f.filename}))
   campground.images.push(...imgs)
   campground.save()
    req.flash('success', 'Successfully update a campground.')
    res.redirect(`/campgrounds/${campground._id}`)

}
module.exports.deleteCampground = async (req, res, next)=>{
    const {id} = req.params
    const campground = await CampGround.findById(id)
    if(campground === null) throw new Error()
    await CampGround.findByIdAndDelete(id)
    req.flash('success', 'Successfully delete a campground.')
    res.redirect(`/campgrounds`)

}
module.exports.showCampground = async ( req, res, next)=>{
    const campground = await CampGround.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path: 'owner'
        }
    }).populate('owner', 'username')
    if(campground === null) throw new Error()
    res.render('show', {campground})
}