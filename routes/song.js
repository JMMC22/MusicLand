'use strict'

var express = require('express');
var md_auth = require('../middlewares/authenticated');
var SongController = require('../controllers/song');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/tracks' });



var api = express.Router();


api.post('/song', md_auth.ensureAuth, SongController.songSave);
api.get('/songs', md_auth.ensureAuth, SongController.getSongs);
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.get('/songs/:page?', md_auth.ensureAuth, SongController.getSongsPagination);
api.get('/songs-search/:query/:page?', md_auth.ensureAuth, SongController.findByTituloAndArtista);





module.exports = api;