var router = require('express').Router();
var multer = require('multer');

const PostModal = require('../models/post.modal');
const authMiddleware = require('../middleware/auth.middleware');
const postAuthorization = require('../middleware/postAuthorization.middlware');

router.use(authMiddleware);


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        var originalName = file.originalname;
        var ext = originalName.split('.').slice(-1)[0];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    }
});

var upload = multer({ storage: storage });


router.get('/', (req, res) => {
    PostModal.getAllPostsForUser(req.session.username)
        .then(posts => {
            return res.render('pages/post', {
                posts: posts
            })
        })
        .catch(err => {
            console.log(err);
        })
});

router.post('/', (req, res) => {
    res.render('pages/post');
});

router.get('/create', (req, res) => {
    res.render('pages/createPost');
});

router.post('/create', upload.single('image'), (req, res) => {
    var { title, description } = req.body;
    var filename = req.file.filename;
    var author = req.session.username;

    PostModal.create(title, description, filename, author)
        .then(_ => res.redirect('/posts'))
        .catch(err => {
            console.log(err);
        })
});

router.post('/edit/:id', postAuthorization, (req, res) => {
    var { title, description } = req.body;
    var { id } = req.params;
    PostModal.update(id, title, description)
        .then(_ => res.redirect('/posts'))
        .catch(err => {
            console.log(err);
        })
});


router.get('/edit/:id', (req, res) => {
    var { id } = req.params;
    PostModal.findById(id)
        .then(post => {
            res.render('pages/editPost', {
                post: post
            });
        })
        .catch(err => {
            console.log(err);
        })
});


router.get('/delete/:id', postAuthorization, (req, res) => {
    var { id } = req.params;
    PostModal.delete(id)
        .then(_ => res.redirect('/posts'))
        .catch(err => {
            console.log(err);
        })
});




module.exports = router;