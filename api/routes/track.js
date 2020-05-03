'use strict'

var express = require('express');
var TrackController = require('../controllers/track');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/tracks' });

var api = express.Router();


api.post('/upload-track/:titulo', [md_auth.ensureAuth, md_upload], TrackController.uploadTrack);
api.get('/get-track/:track', TrackController.getTrackFile);
api.get('/my-tracks/:page?', md_auth.ensureAuth, TrackController.getMyTracks);
api.get('/tracks/:page?', md_auth.ensureAuth, TrackController.getTracks);
api.post('/update-track/:id', md_auth.ensureAuth, TrackController.updateTrack);




module.exports = api;