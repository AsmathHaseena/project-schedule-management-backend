const express = require('express');
const { check } = require('express-validator');

const tasksControllers = require('../controllers/tasks-controllers');
const router = express.Router();

router.get('/', tasksControllers.getTasks);

router.post(
    '/', [
        check('taskName')
        .not()
        .isEmpty(),
        check('taskDescription').isLength({ min: 5 }),
        check('taskStartDate')
        .not()
        .isEmpty(),
        check('taskEndDate')
        .not()
        .isEmpty(),
        check('resourceAllocated')
        .not()
        .isEmpty(),
        check('costAllocated')
        .not()
        .isEmpty(),
        check('taskStatus')
        .not()
        .isEmpty(),
    ],
    tasksControllers.createTask
);

module.exports = router;