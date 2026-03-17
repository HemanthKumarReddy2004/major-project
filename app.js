// if(process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const  ExpressError = require("./utils/ExpressError.js")
// const reviewRoutes = require("./routes/review.js");
// const session = require("express-session");
// const MongoStore = require('connect-mongo');
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");


// const  listingRouter = require("./routes/listing.js");
// const reviewsRouter = require("./routes/review.js");

// const userRouter = require("./routes/user.js");

// const dburl = process.env.ATLASDB_URL;

// main().then(() => {
//     console.log("connect to db");
// }).catch (err => {
//     console.log(err);
// })

// async function main(){
//     await mongoose.connect(dburl);
    
// }

// app.use(express.urlencoded({ extended: true }));
// app.set("view engine","ejs");
// app.set("views", path.join(__dirname,"views"));
// app.use(methodOverride("_method"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));


// const store = MongoStore.create({
//     mongoUrl: dburl,
//     crypto:{
//         secret:process.env.SECRET,
//     },
//     touchAfter:24*3600,
// });

// store.on("error",(err) => {
//     console.log("ERROR  IN MONGO SESSON STORE",err);
// });

// const sessionoptions = {  
//     store,  
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
//         maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
//     }
// };

// app.use(session(sessionoptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());




// app.use((req, res, next) => {
//     res.locals.currentUser = req.user || null;
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// });

// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewsRouter);
// app.use("/", userRouter);


// app.all("*", (req,res,next) => {
// next(new ExpressError(404,"page not found"));
// });

// app.use((err,req,res,next) =>{
//   let{statusCode=500, message = "something went wrong!"} = err;
//   res.status(statusCode).render("Error.ejs", { message });
//   // res.status(statusCode).send(message);
// });

// app.listen(8080, () => {
//     console.log("Server is started");
// });


if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Routes
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dburl = process.env.ATLASDB_URL;


// ✅ CONNECT TO DB
async function main() {
    await mongoose.connect(dburl);
    console.log("Connected to DB");
}

main().catch(err => console.log(err));


// ✅ BASIC SETUP
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


// ✅ TRUST PROXY (VERY IMPORTANT FOR RENDER)
app.set("trust proxy", 1);


// ✅ SESSION STORE
const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR:", err);
});


// ✅ SESSION CONFIG
// const sessionoptions = {
//     store,
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         secure: true,        // 🔥 required for Render (HTTPS)
//         sameSite: "none",    // 🔥 required for cross-site cookies
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7,
//     },
// };
const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true, // 🔥 ADD THIS
    cookie: {
        httpOnly: true,
        secure: true,          // 🔥 FORCE TRUE
        sameSite: "none",      // 🔥 FORCE NONE
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};


// ✅ MIDDLEWARE ORDER (IMPORTANT)
app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


// ✅ PASSPORT CONFIG
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ✅ GLOBAL LOCALS
app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// ✅ DEBUG (REMOVE AFTER TESTING)
app.use((req, res, next) => {
    console.log("USER:", req.user);
    next();
});


// ✅ ROUTES
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// ✅ 404 HANDLER
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


// ✅ ERROR HANDLER (FIXED)
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("Error.ejs", { message });
});


// ✅ START SERVER (RENDER FIX)
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});