'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SongSchema = Schema({

    titulo: String,
    fechaLanzamiento: String,
    imagen: String,
    url: String,
    artist: { type: Schema.ObjectId, ref: 'Artist' }

});

module.exports = mongoose.model('Song', SongSchema);