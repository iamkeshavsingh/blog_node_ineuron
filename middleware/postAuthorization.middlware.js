const PostModal = require('../models/post.modal');

function postAuthorization(req, res, next) {

    var { id } = req.params;
    var author = req.session.username;

    PostModal.findById(id)
        .then(post => {
            if (post && post.author === author.toLowerCase()) {
                return next();
            }
            return res.status(401).json({
                msg: 'Unauthorized'
            });
        })
        .catch(err => {
            console.log(err);
        })
}



module.exports = postAuthorization;