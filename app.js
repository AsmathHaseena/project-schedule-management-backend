const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const usersRoutes = require('./routes/users-routes');
const projectsRoutes = require('./routes/projects-routes');
const tasksRoutes = require('./routes/tasks-routes');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/projects/user', projectsRoutes);
app.use('/api/tasks', tasksRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
    .connect(
        `mongodb+srv://new_user1:SaFpX75Q417uhNmZ@cluster0.iwj5swd.mongodb.net/mern?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });