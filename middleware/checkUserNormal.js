function isNormalUser(req, res, next) {
    if (req.session && req.session.user && req.session.user.is_user) {
        next(); // User is a normal user, proceed to the next middleware or route
    } else {
        res.redirect('/'); // Redirect to home if not a normal user
    }
}
module.exports = isNormalUser;
