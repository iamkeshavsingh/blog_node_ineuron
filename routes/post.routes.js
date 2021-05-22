var router = require('express').Router();
var multer = require('multer');

const PostModal = require('../models/post.modal');
const authMiddleware = require('../middleware/auth.middleware');

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
    TODO: // I need to send the posts for that particular user
    PostModal.getAllPostsForUser(req.session.username)
        .then(posts => {
            return res.render('pages/post', {
                username: req.session ? req.session.username : null,
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
    res.render('pages/createPost', {
        username: req.session ? req.session.username : null
    });
});

router.post('/create', upload.single('image'), (req, res) => {
    var { title, description } = req.body;
    var filename = req.file.filename;
    var author = req.session.username;

    PostModal.createPost(title, description, filename, author)
        .then(_ => res.redirect('/posts'))
        .catch(err => {
            console.log(err);
        })
});





module.exports = router;