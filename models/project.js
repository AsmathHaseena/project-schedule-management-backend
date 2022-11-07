const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    sow: { type: String, required: true },
    projectStartDate: { type: Date, required: true },
    projectEndDate: { type: Date, required: true },
    budgetAllocated: { type: Number, required: true },
    status: { type: String, required: true },
    pmoUser: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    task: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Tasks' }]
});

module.exports = mongoose.model('Project', projectSchema);