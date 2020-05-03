'use strict'

var mongoosePagination = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');
var Song = require('../models/song');




function savePublication(req, res) {
    var params = req.body;
    console.log(params)

    var publication = new Publication();

    if (!params.text) {
        publication.text = "Recomiendo esta canción a mis seguidores!!!"
    } else {
        publication.text = params.text;
    }

    if (!params.file) {
        publication.file = null;
    } else {
        publication.file = params.file;
    }

    publication.created_at = moment().unix();

    publication.user = req.user.sub;

    if (!params.song) {
        publication.song = null;
    } else {
        publication.song = params.song;
    }

    console.log(publication)

    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!publicationStored) return res.status(404).send({ message: 'La publicación NO ha sido guardada.' });

        return res.status(200).send({ publication: publicationStored });
    });

}

function getPublicationTimeline(req, res) {

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 5;


    Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        var follows_clean = [];

        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });

        follows_clean.push(req.user.sub);

        Publication.find({ user: { "$in": follows_clean } }).sort('-created_at').populate('user song file').populate({ path: 'song', populate: { path: 'artist' } }).paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) return res.status(500).send({ message: 'Error en la petición.' });

            if (!publications) return res.status(404).send({ message: 'No hay publicaciones.' });

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                publications: publications
            })
        })

    })


}

function getPublicationsUser(req, res) {

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 5;

    var user_id = req.user.sub;
    if (req.params.user) {
        user_id = req.params.user;
    }

    Publication.find({ user: user_id }).sort('-created_at').populate('user song file').populate({ path: 'song', populate: { path: 'artist' } }).paginate(page, itemsPerPage, (err, publications, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!publications) return res.status(404).send({ message: 'No hay publicaciones.' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            publications: publications
        })
    })

}



function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if (err) return res.status(500).send({ message: 'Error petición.' });

        if (!publication) return res.status(404).send({ message: 'La publicación no existe.' });

        return res.status(200).send({ publication });


    })
}

function deletePublication(req, res) {
    var publicationId = req.params.id;

    Publication.find({ 'user': req.user.sub, '_id': publicationId }).remove(err => {
        if (err) return res.status(500).send({ message: 'Error petición.' });
        //if (!publicationRemoved) return res.status(404).send({ message: 'La publicación no se ha eliminado.' });

        return res.status(200).send({ message: 'Publicaión eliminada.' });

    })
}

function uploadImage(req, res) {
    var publicationId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');

        var file_name = file_split[2];

        var ext_file = file_name.split('\.');
        var file_ext = ext_file[1];


        if (file_ext == 'png' || file_ext == 'jpg') {

            Publication.findOne({ 'user': req.user.sub, '_id': publicationId }).exec((err, publication) => {

                if (publication) {
                    Publication.findByIdAndUpdate(publicationId, { file: file_name }, { new: true }, (err, publicationUpdated) => {
                        if (err) return res.status(500).send({ message: 'Error en la petición.' });

                        if (!publicationUpdated) return res.status(404).send({ message: 'No se ha podido actualizar imagen del usuario.' });

                        return res.status(200).send({ user: publicationUpdated });
                    });

                } else {
                    return removeFilesOfUploads(res, file_path, 'No tienes permisos.');

                }
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

    })
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/publications/' + imageFile;

    fs.exists(path_file, (exits) => {
        if (exits) {
            res.sendFile(path.resolve(path_file));
        } else {
            return res.status(500).send({ message: 'No existe imagen.' });

        }
    })
}

function getTop3CancionesPublicadas(req, res) {

    Publication
        .aggregate([{
            $match: {
                "song": {
                    "$exists": true,
                    "$ne": null
                }
            }
        }, { $group: { _id: "$song", count: { $sum: 1 } } }]).sort({ count: -1 }).limit(3).exec((err, songs) => {
            if (err) return res.status(500).send({ message: 'Error en la petición.' });

            if (!songs) return res.status(404).send({ message: 'No hay canciones disponibles.' });


            Song.populate(songs, { path: '_id' }, (err, songs) => {
                if (err) return res.status(500).send({ message: 'Error en la petición.' });

                if (!songs) return res.status(404).send({ message: 'No hay canciones disponibles.' });

                return res.status(200).send({ songs });



            })




        });
}

module.exports = {

    savePublication,
    getPublicationTimeline,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile,
    getPublicationsUser,
    getTop3CancionesPublicadas

}