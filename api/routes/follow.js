'use strict'

var express = require('express');
var FollowController = require('../controllers/follow');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/follow', md_auth.ensureAuth, FollowController.followSave);
api.delete('/unfollow/:id', md_auth.ensureAuth, FollowController.unfollow);
api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowedUsers);
api.get('/my-follows', md_auth.ensureAuth, FollowController.getMyFollows);
api.get('/my-followed', md_auth.ensureAuth, FollowController.getMyFollowed);





module.exports = api;