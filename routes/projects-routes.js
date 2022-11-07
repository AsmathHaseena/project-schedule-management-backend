const express = require('express');
const { check } = require('express-validator');

const projectsControllers = require('../controllers/projects-controllers');
const router = express.Router();

router.get('/user/:userId', projectsControllers.getProjectsByUserId);

router.get('/:pid', projectsControllers.getProjectById);

router.get('/', projectsControllers.getProjects);

router.post(
    '/', [
        check('projectName')
        .not()
        .isEmpty(),
        check('description').isLength({ min: 5 }),
        check('projectStartDate')
        .not()
        .isEmpty(),
        check('projectEndDate')
        .not()
        .isEmpty(),
        check('budgetAllocated')
        .not()
        .isEmpty(),
        check('status')
        .not()
        .isEmpty(),
        check('pmoUser')
        .not()
        .isEmpty(),
    ],
    projectsControllers.createProject
);

router.patch(
    '/:pid', [
        check('projectName')
        .not()
        .isEmpty(),
        check('description').isLength({ min: 5 }),
        check('status')
        .not()
        .isEmpty(),
        check('pmoUser')
        .not()
        .isEmpty(),
    ],
    projectsControllers.updateProject
);

module.exports = router;