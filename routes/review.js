const express = require("express");
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require("../utils/wrapAsync.js");
const  ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview , isLogin,isReviewAuthor} = require("../middleware.js");


const reviewcontroller = require("../controllers/reviews.js");

// post reviews route
router.post("/",isLogin, validateReview,wrapAsync(reviewcontroller.createReview));


//delete review route

router.delete("/:reviewId",isLogin,isReviewAuthor, wrapAsync(reviewcontroller.destroyReview));


module.exports = router;