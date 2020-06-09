'use strict'

var express = require('express');
var md_auth = require('../middlewares/authenticated');
var MessageController = require('../controllers/message');


var api = express.Router();


api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.post('/message100', md_auth.ensureAuth, MessageController.saveMessage100);
api.get('/messages-rec/:page?', md_auth.ensureAuth, MessageController.getRecMessages);
api.get('/messages-sends/:page?', md_auth.ensureAuth, MessageController.getSendMessages);
api.get('/unvieweds', md_auth.ensureAuth, MessageController.unviewedMessages);
api.post('/set-viewed/:id', md_auth.ensureAuth, MessageController.setViewedMessages);
api.get('/unnotify', md_auth.ensureAuth, MessageController.unviewedAndNotifyMessages);

module.exports = api;