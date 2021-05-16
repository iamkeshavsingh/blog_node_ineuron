var router = require('express').Router();

const authMiddleware = require('../middleware/auth.middleware');


router.use(authMiddleware);

router.get('/', (req, res) => {
    res.render('pages/post');
});





module.exports = router;