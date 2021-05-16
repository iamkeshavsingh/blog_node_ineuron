function authMiddleware(req, res, next) {

    if (!req.session.username) {
        return res.redirect('/signin');
    }

    next();
}




module.exports = authMiddleware;