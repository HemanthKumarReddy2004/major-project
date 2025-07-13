const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLogin , isowner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {  storage } = require("../cloudconfig.js");
const upload = multer({ storage });


router.route("/")
    .get( wrapAsync(listingController.index)) //index route
    .post(isLogin, upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.createListing)); // Create Route
//new route
router.get("/new", isLogin, listingController.renderNewForm);

router.route("/:id")
    .get( wrapAsync(listingController.showListings)) // Show Route
    .put(isLogin,isowner,upload.single("listing[image][url]"),validateListing, wrapAsync(listingController.updateListing)) // Update Route
    .delete( isLogin,isowner,wrapAsync(listingController.destroyListing)); // Delete Route



//edit route
router.get("/:id/edit", isLogin,isowner,wrapAsync(listingController.renderEditForm));


module.exports = router;    