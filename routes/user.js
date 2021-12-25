const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../schema/user')
const passport = require('passport');

router.get('/register', function (req, res) {
    res.render('user/register')
})
router.post('/register', async function (req, res, next) {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, error =>{
            if(error) return next(error);
            req.flash('success', 'Welcome to YelpCamp')
        res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }

})
router.get('/login', function (req, res) {
    res.render('user/login')
})

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    successFlash: true,
    failureRedirect: '/login',
}),
     function (req, res) {
        const currentUrl = req.session.currentUrl || '/campgrounds'
        delete req.session.currentUrl
        req.flash('success','Welcome back to YelpCamp')
        res.redirect(currentUrl)
    })

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'Goodbye')
    res.redirect('/campgrounds')
})
module.exports = router