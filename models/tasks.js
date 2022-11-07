const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const tasksSchema = new Schema({
    taskName: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskStartDate: { type: Date, required: true },
    taskEndDate: { type: Date, required: true },
    resourceAllocated: { type: Number, required: true },
    costAllocated: { type: Number, required: true },
    taskStatus: { type: String, required: true },
    subTask: [
        new Schema({
            subtaskName: { type: String, required: false },
            subtaskDescription: { type: String, required: false },
            subtaskStartDate: { type: Date, required: false },
            subtaskEndDate: { type: Date, required: false },
            subtaskStatus: { type: String, required: false },
        })
    ],
    project: { type: mongoose.Types.ObjectId, required: true, ref: 'Project' },
    // user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

tasksSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Tasks', tasksSchema);