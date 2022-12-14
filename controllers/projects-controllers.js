const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Project = require('../models/project');
const User = require('../models/user');

const getProjectsByUserId = async(req, res, next) => {
    const pmoUserId = req.params.userId;
    let projects;
    try {
        projects = await Project.find({
            pmoUser: pmoUserId
        })
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find projects.',
            500
        );
        return next(error);
    }

    if (!projects) {
        const error = new HttpError(
            'Could not find projects for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ projects: projects.map(project => project.toObject({ getters: true })) });
};

const getProjectById = async(req, res, next) => {
    const projectId = req.params.pid;
    let project;
    try {
        project = await Project.findById(projectId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find projects.',
            500
        );
        return next(error);
    }

    if (!project) {
        const error = new HttpError(
            'Could not find projects for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ project: project.toObject({ getters: true }) });
};

const getProjects = async(req, res, next) => {
    let projects;
    try {
        projects = await Project.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Fetching projects failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({ projects: projects.map(project => project.toObject({ getters: true })) });
};


const createProject = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const {
        projectName,
        description,
        sow,
        projectStartDate,
        projectEndDate,
        budgetAllocated,
        status,
        creator,
        pmoUser,
    } = req.body;

    const createdProject = new Project({
        projectName,
        description,
        sow,
        projectStartDate,
        projectEndDate,
        budgetAllocated,
        status,
        creator,
        pmoUser,
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(
            'Creating project failed, please try again.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdProject.save({ session: sess });
        user.project.push(createdProject);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating project failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ project: createdProject });
};

const updateProject = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { projectName, description, status, pmoUser } = req.body;
    const projectId = req.params.pid;
    let project;
    try {
        project = await Project.findById(projectId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a place.',
            500
        );
        return next(error);
    }


    project.projectName = projectName;
    project.description = description;
    project.status = status;
    project.pmoUser = pmoUser;

    try {
        await project.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update place.',
            500
        );
        return next(error);
    }

    res.status(200).json({ project: project.toObject({ getters: true }) });
};

exports.createProject = createProject;
exports.getProjectById = getProjectById;
exports.getProjectsByUserId = getProjectsByUserId;
exports.getProjects = getProjects;
exports.updateProject = updateProject;