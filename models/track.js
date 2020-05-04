'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TrackSchema = Schema({

    titulo: String,
    file: String,
    status: String,
    user: { type: Schema.ObjectId, ref: 'User' }

});

module.exports = mongoose.model('Track', TrackSchema);