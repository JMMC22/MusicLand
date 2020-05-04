'use strict'

var mongoosePagination = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function followSave(req, res) {
    var params = req.body;

    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!followStored) return res.status(404).send({ message: 'No se ha podido guardar el follow.' });

        return res.status(200).send({ follow: followStored });
    })
}

function unfollow(req, res) {
    var userId = req.user.sub;
    var followedId = req.params.id;

    Follow.find({ 'user': userId, 'followed': followedId }).remove(err => {
        if (err) return res.status(500).send({ message: 'Error al realizar unfollow.' });

        return res.status(200).send({ message: 'Se ha realizado el unfollow.' })
    });
}

function getFollowingUsers(req, res) {
    var userId = req.user.sub;

    if (req.params.id) {
        userId = req.params.id;
    }

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({ user: userId }).populate({ path: 'followed' })
        .paginate(page, itemsPerPage, (err, follows, total) => {
            if (err) return res.status(500).send({ message: 'Error al realizar unfollow.' });

            if (!follows) return res.status(404).send({ message: 'No hay follows.' });

            followUserIds(userId).then((value) => {

                return res.status(200).send({
                    follows,
                    users_following: value.following,
                    users_followed: value.followed,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            });

        })
}

async function followUserIds(user_id) {

    var following = await Follow.find({ "user": user_id }).select({ '_id': 0, '__v': 0, 'user': 0 }).exec()
        .then((following) => {
            return following;
        }).catch((err) => {
            return handleError(err);
        });


    var followed = await Follow.find({ "followed": user_id }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
        .then((followed) => {
            return followed;
        }).catch((err) => {
            return handleError(err);
        });

    //Procesando followings
    var following_clean = [];

    following.forEach((follow) => {
        following_clean.push(follow.followed);
    });

    //Procesando followeds
    var followed_clean = [];

    followed.forEach((follow) => {
        followed_clean.push(follow.user);
    });

    return {
        following: following_clean,
        followed: followed_clean
    }
}

function getFollowedUsers(req, res) {
    var userId = req.user.sub;

    if (req.params.id) {
        userId = req.params.id;
    }

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({ followed: userId }).populate({ path: 'user' })
        .paginate(page, itemsPerPage, (err, follows, total) => {
            if (err) return res.status(500).send({ message: 'Error en la petición.' });

            if (!follows) return res.status(404).send({ message: 'No hay follows.' });

            followUserIds(userId).then((value) => {

                return res.status(200).send({
                    follows,
                    users_following: value.following,
                    users_followed: value.followed,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            });

        })
}

function getMyFollows(req, res) {
    var userId = req.user.sub;

    Follow.find({ user: userId }).populate('user followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!follows) return res.status(404).send({ message: 'No hay follows.' });

        return res.status(200).send({ follows })
    })
}

function getMyFollowed(req, res) {
    var userId = req.user.sub;

    Follow.find({ followed: userId }).populate('user followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!follows) return res.status(404).send({ message: 'No hay follows.' });

        return res.status(200).send({ follows })
    })
}
module.exports = {

    followSave,
    unfollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollowed,
    getMyFollows

}