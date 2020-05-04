'use strict'

var mongoosePagination = require('mongoose-pagination');
var moment = require('moment');
var fs = require('fs');
var path = require('path');

var Track = require('../models/track');
var Message = require('../models/message');



function uploadTrack(req, res) {
    var titulo = req.params.titulo;
    console.log(req)
    console.log("dferg")
    console.log(req.files)

    if (req.files) {
        var file_path = req.files.track.path;
        var file_split = file_path.split('/');

        var file_name = file_split[2];

        var ext_file = file_name.split('\.');
        var file_ext = ext_file[1];

        if (file_ext == 'mp3') {

            var track = new Track();

            track.titulo = titulo;
            track.file = file_name;
            track.status = "PENDING";
            track.user = req.user.sub;

            track.save((err, trackStored) => {
                if (err) return res.status(500).send({ message: 'Error en la petición.' });

                if (!trackStored) return res.status(404).send({ message: 'No se ha podido guardar la pista.' });

                return res.status(200).send({ track: trackStored });
            })

        } else {
            return removeFilesOfUploads(res, file_path, 'Extensión no válida.');
        }
    } else {
        return res.status(500).send({ message: 'No se han subido tracks.' });
    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        if (err) return res.status(500).send({ message: message });

    })
}

function getMyTracks(req, res) {
    var userId = req.user.sub;

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    Track.find({ user: userId }).populate('user').paginate(page, itemsPerPage, (err, tracks, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!tracks) return res.status(404).send({ message: 'No hay pistas disponibles.' });

        return res.status(200).send({
            tracks,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}


function getTrackFile(req, res) {
    var track = req.params.track;
    var path_file = './uploads/tracks/' + track;

    fs.exists(path_file, (exits) => {
        if (exits) {
            res.sendFile(path.resolve(path_file));
        } else {
            return res.status(500).send({ message: 'No existe track.' });

        }
    })
}

function updateTrack(req, res) {
    var trackId = req.params.id;
    var update = req.body;
    var identity_user_role = req.user.role;
    if (identity_user_role != 'ROLE_ADMIN') {

        return res.status(403).send({ message: 'No tienes acceso.' });

    }

    Track.findByIdAndUpdate(trackId, update, { new: true }, (err, trackUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!trackUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el track.' });

        var message = new Message();

        message.emitter = req.user.sub;
        message.receiver = trackUpdated.user;

        var statusES;
        if (trackUpdated.status == 'ACCEPTED') {
            statusES = "ACEPTADO";
        } else {
            statusES = "RECHAZADO"
        }
        message.text = "Su pista ha sido " + statusES;
        message.created_at = moment().unix();
        message.viewed = false;

        message.save((err, messageStored) => {
            if (err) return res.status(500).send({ message: "Error petición." })
            if (!messageStored) return res.status(404).send({ message: "Error al enviar mensaje." })
        })

        return res.status(200).send({ track: trackUpdated });
    })
}

//Usuarios paginados
function getTracks(req, res) {
    var identity_user_role = req.user.role;
    if (identity_user_role != 'ROLE_ADMIN') {

        return res.status(403).send({ message: 'No tienes acceso.' });

    }

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    Track.find().sort('titulo').populate('user').paginate(page, itemsPerPage, (err, tracks, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!tracks) return res.status(404).send({ message: 'No hay pistas disponibles.' });

        return res.status(200).send({
            tracks,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });

}

module.exports = {

    uploadTrack,
    getMyTracks,
    getTrackFile,
    updateTrack,
    getTracks

}