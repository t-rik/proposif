function isJury(req, res, next) {
    if (req.session.isJury) {
        res.redirect('/voting-sessions/jury/vote');
    } else { 
        next();
    }
}
module.exports = isJury;
