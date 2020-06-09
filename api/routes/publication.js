'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/publications' });

var api = express.Router();

api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublicationTimeline);
api.get('/publications-user/:user/:page?', md_auth.ensureAuth, PublicationController.getPublicationsUser);
api.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);
api.delete('/publication/:id', md_auth.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image-pub/:id', [md_auth.ensureAuth, md_upload], PublicationController.uploadImage);
api.get('/get-image-pub/:imagenFile', md_auth.ensureAuth, PublicationController.getImageFile);
api.get('/get-top3songs', md_auth.ensureAuth, PublicationController.getTop3CancionesPublicadas);
api.get('/get-best-user', md_auth.ensureAuth, PublicationController.bestUser);
api.get('/get-publications-users', md_auth.ensureAuth, PublicationController.getCountPublicationsUser);
api.get('/get-7days', md_auth.ensureAuth, PublicationController.getLast7DaysPublications);




module.exports = api;