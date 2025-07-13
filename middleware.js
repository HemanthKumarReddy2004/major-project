const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const Review = require("./models/review");

module.exports.isLogin = (req, res, next) => {
if (!req.isAuthenticated()) {
  req.session.redirectUrl = req.originalUrl; 
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/login");
  }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isowner = async(req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error", "You do not have permission to edit this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errmsg);
  }else{
  next();
  }
};  


module.exports. validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errmsg);
  }else{
  next();
  }
};  


module.exports.isReviewAuthor = async(req, res, next) => {
  let { id,reviewId } = req.params;
  let review  = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currentUser._id)){
    req.flash("error", "You do not have permission to delete this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}