const mongoose = require('mongoose')

const statusSchema = new mongoose.Schema({

}, { timestamps: true })

const Status = mongoose.model('Status', statusSchema);
module.exports = Status;