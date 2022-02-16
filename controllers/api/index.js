const router = require('express').Router();

const userRouters = require('./user-routes.js');


router.use('/users', userRouters);

module.exports = router;