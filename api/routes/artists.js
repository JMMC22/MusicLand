'use strict'

var express = require('express');
var md_auth = require('../middlewares/authenticated');
var ArtistController = require('../controllers/artist');


var api = express.Router();


api.post('/artist', md_auth.ensureAuth, ArtistController.artistSave);
api.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/search-artist/:query/:page?', md_auth.ensureAuth, ArtistController.findByNombre);
api.get('/all-artists', md_auth.ensureAuth, ArtistController.getArtists);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtistsPagination);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);





module.exports = api;