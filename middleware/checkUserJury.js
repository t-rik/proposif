function isJury(req, res, next) {
    if (req.session.isJury) {
        res.redirect('/voting-sessions/jury/vote/next');
    } else { 
        next();
    }
}
module.exports = isJury;
