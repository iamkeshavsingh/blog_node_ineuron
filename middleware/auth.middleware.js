function authMiddleware(req, res, next) {

    if (!req.session.username) {
        return res.redirect('/signin');
    }

    res.locals.username = req.session.username;
    next();
}




module.exports = authMiddleware;