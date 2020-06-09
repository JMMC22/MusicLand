'use strict'

var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');
var Message = require('../models/message');
var Track = require('../models/track');



var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');



function home(req, res) {
    res.status(200).send({
        message: "Hola Mundo!"
    });
}

function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    //Validación campos
    if (params.username.length < 4 || params.password.length < 6) {
        return res.status(500).send({ message: 'Error en la petición.' })
    }

    if (params.username && params.password && params.email) {

        user.username = params.username;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.avatar = 'user.png';

        //Comprobación usuarios duplicados.
        User.find({ $or: [{ 'username': { $regex: user.username, $options: 'i' } }, { 'email': { $regex: user.email, $options: 'i' } }] }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la petición.' })
            if (users && users.length > 0) {
                return res.status(200).send({ message: 'El usuario ya está registrado.' })
            } else {
                //Cifrar password y guardar datos.
                bcrypt.hash(params.password, null, null, (error, hash) => {
                    if (error) return res.status(500).send({ message: 'Error al guardar usuario.' })

                    user.password = hash;

                    user.save((err, userStored) => {

                        if (err) return res.status(500).send({ message: 'Error al guardar usuario.' })

                        if (userStored) {
                            res.status(200).send({ user: userStored })
                        } else {
                            res.status(404).send({ message: 'Usuario no registrado.' })
                        }
                    });
                });
            }
        });


    }

}

function loginUser(req, res) {
    var params = req.body;

    if (!params.username || !params.password) {
        if (err) return res.status(500).send({ message: 'Error petición login' });
    }

    var username = params.username;
    var password = params.password;

    User.findOne({ username: username }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error petición login' });

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (params.gettoken) {
                        //Generar y devolver token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        //Decolver datos usuario
                        user.password = undefined; //Esto lo hacemos para que no devuelva la password.
                        return res.status(200).send({ user });
                    }
                } else {
                    return res.status(404).send({ message: 'El usuario no se ha podido identidficar.' });
                }
            });
        } else {
            return res.status(404).send({ message: 'El usuario no se ha podido identidficar.' });
        }
    })
}

function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error petición.' });
        if (!user) return res.status(404).send({ message: 'El usuario no existe.' });

        followThisUser(req.user.sub, userId).then((value) => {
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            })
        })
    })
}

async function followThisUser(identity_user_id, user_id) {
    var following = await Follow.findOne({ "user": identity_user_id, "followed": user_id }).exec()
        .then((following) => {
            return following;
        }).catch((err) => {
            return handleError(err);
        });


    var followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id }).exec()
        .then((followed) => {
            return followed;
        }).catch((err) => {
            return handleError(err);
        });
    return {
        following: following,
        followed: followed
    }
}

//Usuarios paginados
function getUsers(req, res) {

    var identity_user_id = req.user.sub;

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5; {
        User.find({ "username": { $ne: "admin" }, "_id": { $ne: identity_user_id } }).sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
            if (err) return res.status(500).send({ message: 'Error en la petición.' });

            if (!users) return res.status(404).send({ message: 'No hay usuarios disponibles.' });

            followUserIds(identity_user_id).then((value) => {

                return res.status(200).send({
                    users,
                    users_following: value.following,
                    users_followed: value.followed,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            });

        });
    }
}

function getAllUsers(req, res) {

    var identity_user_id = req.user.sub;


    User.find({ "username": { $ne: "admin" }, "_id": { $ne: identity_user_id } }, (err, users) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });
        if (!users) return res.status(404).send({ message: 'No hay usuarios disponibles.' });
        return res.status(200).send({ users })


    });

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

function getCounters(req, res) {
    if (req.params.id) {
        getCountFollows(req.params.id).then((value) => {
            return res.status(200).send(value);
        })
    } else {
        getCountFollows(req.user.sub).then((value) => {
            return res.status(200).send(value);
        })
    }
}
async function getCountFollows(user_id) {
    var following = await Follow.countDocuments({ "user": user_id }).exec().then((following) => {
        return following;
    }).catch((err) => {
        return handleError(err);
    });

    var followed = await Follow.countDocuments({ "followed": user_id }).exec().then((followed) => {
        return followed;
    }).catch((err) => {
        return handleError(err);
    });

    var publications = await Publication.countDocuments({ "user": user_id }).exec().then((publications) => {
        return publications;
    }).catch((err) => {
        return handleError(err);
    });

    return {
        following: following,
        followed: followed,
        publications: publications
    }
}
//Editar usuario

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    //Borrar password
    delete update.password;


    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permisos.' });
    }

    if (!update.username || !update.email || !update.avatar) return res.status(200).send({ message: "Enviar datos necesarios." })

    User.find({ $or: [{ 'username': { $regex: update.username, $options: 'i' } }, { 'email': { $regex: update.email, $options: 'i' } }] }).exec((err, users) => {
        if (err) return res.status(500).send({ message: 'Error en la petición usuario.' })

        if (users.length > 0 && users[0]._id != userId) {
            return res.status(200).send({ message: 'Los datos ya están en uso.' })
        } else {
            User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
                if (err) return res.status(500).send({ message: 'Error en la petición.' });

                if (!userUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el usuario.' });

                return res.status(200).send({ user: userUpdated });
            })
        }


    })
}

function uploadImage(req, res) {
    var userId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');

        var file_name = file_split[2];

        var ext_file = file_name.split('\.');
        var file_ext = ext_file[1];


        if (userId != req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'No tienes permisos.');
        }

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == "jpeg") {

            User.findByIdAndUpdate(userId, { avatar: file_name }, { new: true }, (err, userUpdated) => {
                if (err) return res.status(500).send({ message: 'Error en la petición.' });

                if (!userUpdated) return res.status(404).send({ message: 'No se ha podido actualizar imagen del usuario.' });

                return res.status(200).send({ user: userUpdated });
            })

        } else {
            return removeFilesOfUploads(res, file_path, 'Extensión no válida.');
        }

    } else {
        return res.status(500).send({ message: 'No se han subido imágenes.' });
    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        if (err) return res.status(500).send({ message: message });
        return res.status(500).send({ message: message });

    })
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, (exits) => {
        if (exits) {
            res.sendFile(path.resolve(path_file));
        } else {
            return res.status(500).send({ message: 'No existe imagen.' });

        }
    })
}

function findByUsername(req, res) {
    var identity_user_id = req.user.sub;
    var username = req.params.usernameSearch;


    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;


    User.find({ "username": { '$regex': username, $options: 'i', $ne: "admin" } }).sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!users) return res.status(404).send({ message: 'No hay usuarios disponibles.' });

        followUserIds(identity_user_id).then((value) => {

            return res.status(200).send({
                users,
                users_following: value.following,
                users_followed: value.followed,
                total,
                pages: Math.ceil(total / itemsPerPage)
            });
        });


    });

}

function deleteUser(req, res) {

    var userId = req.params.id;
    var identity_user_role = req.user.role;
    if (identity_user_role != 'ROLE_ADMIN') {

        return res.status(403).send({ message: 'No tienes acceso.' });

    }

    Follow.remove({
        $or: [
            { user: userId },
            { followed: userId }
        ]
    }).exec();

    Message.remove({
        $or: [
            { emitter: userId },
            { receiver: userId }
        ]
    }).exec();

    Publication.remove({ user: userId }).exec();
    Track.remove({ user: userId }).exec();

    User.find({ '_id': userId }).remove(err => {
        if (err) return res.status(500).send({ message: 'Error petición.' });

        return res.status(200).send({ message: 'Usuario eliminado.' });

    })
}

function recomendedUsers(req, res) {
    var user_id = req.user.sub;

    User.countDocuments().exec((err, count) => {
        if (err) return res.status(500).send({ message: 'Error petición.' });

        // Count -1 ya que tenemos que quitar uno del user logueado.
        var random = Math.floor(Math.random() * (count - 1))
        if (random <= 3) {
            random = 0;
        }

        getSimilarPublications(user_id).then((value) => {
            User.find({ '_id': { "$in": value.users }, 'username': { $ne: "admin" } }).skip(random).limit(3).exec((err, users) => {
                if (err) return res.status(500).send({ message: 'Error petición.' });
                if (!users) return res.status(404).send({ message: 'No hay usuarios disponibles.' });

                return res.status(200).send({ users });

            });
        }).catch((err) => {
            return handleError(err);
        });
    })
}
async function getSimilarPublications(user_id) {

    var publications = await Publication.find({ user: user_id, $and: [{ 'song': { $ne: null } }] }).exec().then((value) => {
        return value;
    }).catch((err) => {
        return handleError(err);
    });

    var songs = [];

    publications.forEach((publication) => {
        songs.push(publication.song);
    });


    var similar = await Publication.find({
        $and: [
            { "user": { $ne: user_id } },
            { "song": { "$in": songs } }
        ]
    }).exec().then((pub) => {
        return pub
    }).catch((err) => {
        return handleError(err);
    });


    var similarsUsers = [];

    similar.forEach((publication) => {
        similarsUsers.push(publication.user.toString());
    });


    var follows = await Follow.find({
        $and: [
            { user: user_id },
            { followed: { "$in": similarsUsers } }
        ]
    }).exec().then((value) => {
        return value
    }).catch((err) => {
        return handleError(err);
    });


    follows.forEach((follow) => {
        var i = similarsUsers.includes(follow.followed.toString());
        if (i == true) {
            let index = similarsUsers.indexOf(follow.followed.toString());
            similarsUsers.splice(index, 1);


        }
    });


    return {
        users: similarsUsers
    }



}

function userPerFollows(req, res) {
    usersAndFollows().then((value) => {
        return res.status(200).send({
            value
        })
    })
}

async function usersAndFollows() {


    var followed = await Follow.find().populate('followed').exec()
        .then((followed) => {
            return followed;
        }).catch((err) => {
            return handleError(err);
        });

    //Procesando followings
    var followed_clean = [];

    followed.forEach((follow) => {
        followed_clean.push(follow.followed.username);
    });

    var usuario_cont = followed_clean.reduce((cont, user) => {
        cont[user] = (cont[user] || 0) + 1;
        return cont;
    }, {});

    var users = await User.find().exec()
        .then((users) => {
            return users;
        }).catch((err) => {
            return handleError(err);
        });

    //Procesando followings
    var users_clean = [];

    users.forEach((user) => {
        users_clean.push(user.username);
    });


    users_clean.forEach((user) => {
        if (Object.keys(usuario_cont).includes(user.toString()) == false) {
            usuario_cont[user] = 0;
        }

    });
    var output = Object.entries(usuario_cont).map(([user, cont]) => ({ user, cont }));

    output.sort(function(a, b) {
        if (a.cont < b.cont) {
            return 1;
        }
        if (a.cont > b.cont) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    return { output }


}

module.exports = {
    home,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounters,
    findByUsername,
    deleteUser,
    recomendedUsers,
    getAllUsers,
    userPerFollows
}