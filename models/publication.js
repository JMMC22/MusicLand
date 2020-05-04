'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = Schema({

    text: String,
    file: { type: Schema.ObjectId, ref: 'Track' },
    created_at: String,
    user: { type: Schema.ObjectId, ref: 'User' },
    song: { type: Schema.ObjectId, ref: 'Song' }



});

module.exports = mongoose.model('Publication', PublicationSchema);