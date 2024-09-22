function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.is_admin) {
        next();
    } else {
        res.redirect('/'); 
    }
}

module.exports = isAdmin;
