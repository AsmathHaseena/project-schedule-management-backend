const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Project = require('../models/project');
const Tasks = require('../models/tasks');
const User = require('../models/user');

const createTask = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const {
        taskName,
        taskDescription,
        taskStartDate,
        taskEndDate,
        resourceAllocated,
        costAllocated,
        taskStatus,
        projectId,
        subTask
    } = req.body;

    let project;
    try {
        project = await Project.findById(projectId);
    } catch (err) {
        const error = new HttpError(
            'Creating task failed, please try again.',
            500
        );
        return next(error);
    }

    if (!project) {
        const error = new HttpError('Could not find project for provided id.', 404);
        return next(error);
    }

    const createdTask = new Tasks({
        taskName,
        taskDescription,
        taskStartDate,
        taskEndDate,
        resourceAllocated,
        costAllocated,
        taskStatus,
        project,
        subTask,
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTask.save({ session: sess });
        project.task.push(createdTask);
        await project.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating task failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ task: createdTask });
};

const getTasks = async(req, res, next) => {
    let tasks;
    try {
        tasks = await Tasks.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Fetching tasks failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({ tasks: tasks.map(task => task.toObject({ getters: true })) });
};

exports.createTask = createTask;
exports.getTasks = getTasks;