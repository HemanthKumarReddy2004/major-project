const User = require("../models/user.js");


//rendering the signup page
module.exports.RendersignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


//post signup route
module.exports.signup =  async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ username, email });
       const rehisterUser = await User.register(newuser, password);
       console.log(rehisterUser);
        req.login(rehisterUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

//rendering the login page
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

//post login route
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//logout route
module.exports.logout = (req, res,next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    });
};