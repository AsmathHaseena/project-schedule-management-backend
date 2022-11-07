const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getPMOUsers = async(req, res, next) => {
    let users;
    try {
        users = await User.find({ role: "PMO" });
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const getUsers = async(req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const {
        name,
        email,
        password,
        recoveryQn,
        recoveryAns,
        role
    } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        );
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password,
        recoveryQn,
        recoveryAns,
        role,
        project: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async(req, res, next) => {
    const { email, password, recoveryAns } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!existingUser ||
        (password && existingUser.password !== password) ||
        (recoveryAns && existingUser.recoveryAns !== recoveryAns)) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }

    res.json({
        message: 'Logged in!',
        user: existingUser.toObject({ getters: true })
    });
};

const getSecurityQuestion = async(req, res, next) => {
    const emailId = req.params.emailId;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: emailId });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the user.',
            500
        );
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError(
            'Could not find the user for the provided email id.',
            404
        );
        return next(error);
    }

    res.json({ user: existingUser.toObject({ getters: true }) });

};


exports.getPMOUsers = getPMOUsers;
exports.getSecurityQuestion = getSecurityQuestion;
exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;