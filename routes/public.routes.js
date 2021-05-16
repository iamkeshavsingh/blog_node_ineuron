const router = require('express').Router();

const UserModel = require('../models/user.modal');



router.get('/', (req, res) => {
    res.render('pages/home', {
        username: req.session.username
    });
});


router.get('/about', (req, res) => {
    res.render('pages/about', {
        username: req.session.username
    });
});

router.get('/signin', (req, res) => {
    res.render('pages/signin', {
        username: req.session.username
    });
});


router.get('/signup', (req, res) => {
    res.render('pages/signup', {
        username: req.session.username
    });
});

router.post('/signin', async (req, res) => {
    // TODO: Validate the username and Password
    var { username, password } = req.body;
    var user = await UserModel.findByUsername(username.toLowerCase());

    if (user && user.password === password) {
        // User is Valid
        req.session.username = username;
        return res.redirect('/', {
            username: req.session.username
        });
    }

    // TODO: Username and password are incorrect
});



router.post('/signup', async (req, res) => {

    const { username, name, mobile, password } = req.body;

    // TODO: Validate the data

    var isPresent = await UserModel.checkUsername(username);
    if (isPresent) {
        // TODO: I need to notify user that username is present
        return;
    }
    await UserModel.create({ ...req.body, username: username.toLowerCase() });
    req.session.username = username;
    res.redirect('/', {
        username: req.session.username
    });
});


router.get('/logout', async (req, res) => {
    req.session.destroy();
    return res.redirect('/signin');
});



module.exports = router;