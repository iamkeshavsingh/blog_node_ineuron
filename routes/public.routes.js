const router = require('express').Router();
const { body, validationResult } = require('express-validator');

const UserModel = require('../models/user.modal');
const PostModal = require('../models/post.modal');

router.use(function (req, res, next) {
    var username = req.session && req.session.username;
    if (!username) {
        res.locals.username = '';
    }
    else {
        res.locals.username = username;
    }
    next();
});

function renderPage() {
    return PostModal.findAll()
        .then(data => data);
}


router.get('/', (req, res) => {
    renderPage()
        .then(data => {
            res.render('pages/home', {
                posts: data
            });
        })
});


router.get('/about', (req, res) => {
    res.render('pages/about');
});

router.get('/signin', (req, res) => {
    res.render('pages/signin', {
        user: null,
        password: null,
        error: null
    })
});


router.get('/signup', (req, res) => {
    res.render('pages/signup', {
        username: null,
        name: null,
        password: null,
        mobile: null,
        error: null
    });
});

router.post('/signin', [
    body('username').not().isEmpty().withMessage('Please Enter Username'),
    body('password')
        .not()
        .isEmpty().withMessage('Please Enter Password')
], async (req, res) => {

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorString = errors.array().reduce(function (acc, val) {
            acc = acc + val.msg + ' ';
            return acc;
        }, '');
        res.render('pages/signin', {
            user: req.body.username,
            password: req.body.password,
            error: errorString
        });
    }

    var { username, password } = req.body;
    var user = await UserModel.findByUsername(username.toLowerCase());

    if (user && user.password === password) {
        // User is Valid
        req.session.username = username;
        res.locals.username = username;
        return renderPage()
            .then(data => {
                res.render('pages/home', {
                    posts: data
                });
            })
    }

    res.render('pages/signin', {
        user: username,
        password: password,
        error: 'Username and Password is Incorrect'
    });
});



router.post('/signup', [
    body('username')
        .not()
        .isEmpty().withMessage('Username is Required')
        .bail()
        .custom(function (value) {
            return new Promise((resolve, reject) => {
                UserModel.checkUsername(value)
                    .then(isPresent => {
                        if (isPresent) {
                            return reject('Username is Already Present');
                        }
                        resolve();
                    })
            })
        })
], async (req, res) => {

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorString = errors.array().reduce(function (acc, val) {
            acc = acc + val.msg + ' ';
            return acc;
        }, '');
        res.render('pages/signup', {
            ...req.body,
            error: errorString
        });
    }
    await UserModel.create({ ...req.body, username: username.toLowerCase() });
    req.session.username = username;
    res.locals.username = username;
    renderPage()
        .then(data => {
            res.render('pages/home', {
                posts: data
            });
        })
});


router.get('/logout', async (req, res) => {
    req.session.destroy();
    return res.redirect('/signin');
});



module.exports = router;