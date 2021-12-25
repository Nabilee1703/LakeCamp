if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const app = express();


const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const path = require('path');
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
const mongoose = require('mongoose');

const User = require('./schema/user');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const user = require('./routes/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');

// const Errorschema = require('./schema/errorschema');

const MongoDBLink = process.env.MONGODB_LINK || 'mongodb://localhost:27017/yelpcamp'
const secret = process.env.SECRET
app.set('trust proxy', 1); 
const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: MongoDBLink,
        secret: secret,
        touchAfter: 24 * 60 * 60
    }),
    name: 'ChanHoa',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))

async function main() {
    await mongoose.connect(MongoDBLink);
}
main()
    .then(() => {
        console.log('Connected yelpcamp database')
    })
    .catch(err => console.log(err));

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listened port ${port}`)
})
app.engine('ejs', ejsMate)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(mongoSanitize());

passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(
    helmet({
        referrerPolicy: { policy: "no-referrer" },
    })
);

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://code.jquery.com",
    "https://cloudinary.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
];
const connectSrcUrls = [
    "https://cloudinary.com/",
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/diwpadoiz/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home')
})
app.use('/campgrounds', campgrounds)

app.use('/campgrounds/:id', reviews)

app.use('/', user)
app.all('*', (req, res, next) => {
    next()
})
app.use(function (error, req, res, next) {
    res.status(500)
    res.render('error', 'Page not found!')

})
