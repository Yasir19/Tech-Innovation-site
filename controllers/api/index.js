const router = require('express').Router();

const userRouters = require('./user-routes');
const postRouters = require('./post-routes');
const commentRouters = require('./comment_routes');


router.use('/users', userRouters);
router.use('/posts', postRouters);
router.use('/comments',commentRouters);

module.exports = router;