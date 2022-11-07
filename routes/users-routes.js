const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersController.getUsers);

router.get('/pmo', usersController.getPMOUsers);

router.get('/:emailId', usersController.getSecurityQuestion);

router.post(
    '/signup', [
        check('name')
        .not()
        .isEmpty(),
        check('email')
        .normalizeEmail()
        .isEmail(),
        check('password').isLength({ min: 6 }),
        check('recoveryQn')
        .not()
        .isEmpty(),
        check('recoveryAns')
        .not()
        .isEmpty(),
    ],
    usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;