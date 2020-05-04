'use strict'

var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Song = require('../models/song');
var Publication = require('../models/publication');


function artistSave(req, res) {
    var params = req.body;
    var identity_user_role = req.user.role;
    if (identity_user_role != 'ROLE_ADMIN') {

        return res.status(403).send({ message: 'No tienes acceso.' });

    }

    var artist = new Artist();

    artist.nombre = params.nombre;
    artist.fechaNacimiento = params.fechaNacimiento;
    artist.nacionalidad = params.nacionalidad;
    artist.imagen = params.imagen;

    artist.save((err, artistStored) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!artistStored) return res.status(404).send({ message: 'No se ha podido guardar el artista.' });

        return res.status(200).send({ artist: artistStored });
    })
}

//Editar artista

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;
    var identity_user_role = req.user.role;
    if (identity_user_role != 'ROLE_ADMIN') {

        return res.status(403).send({ message: 'No tienes acceso.' });

    }

    Artist.findByIdAndUpdate(artistId, update, { new: true }, (err, artistUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!artistUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el artista.' });

        return res.status(200).send({ artist: artistUpdated });
    })
}

function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) return res.status(500).send({ message: 'Error petición.' });

        if (!artist) return res.status(404).send({ message: 'El artista no existe.' });

        return res.status(200).send({ artist: artist })

    })
}
//Artistas sin paginar.
function getArtists(req, res) {

    Artist.find().sort('nombre').exec((err, artists) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!artists) return res.status(404).send({ message: 'No hay artistas disponibles.' });


        return res.status(200).send({ artists });

    });
}

//Usuarios paginados
function getArtistsPagination(req, res) {

    var identity_user_role = req.user.role;
    if (identity_user_role != 'ROLE_ADMIN') {

        return res.status(403).send({ message: 'No tienes acceso.' });

    }

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 6;

    Artist.find().sort('nombre').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!artists) return res.status(404).send({ message: 'No hay artistas disponibles.' });

        return res.status(200).send({
            artists,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });

}

function deleteArtist(req, res) {
    var artistId = req.params.id;
    var identity_user_role = req.user.role;
    if (identity_user_role != 'ROLE_ADMIN') {

        return res.status(403).send({ message: 'No tienes acceso.' });

    }

    Song.find({ artist: artistId }).exec().then((value) => {
        Publication.remove({ "song": { "$in": value } }).exec();
    }).catch((err) => {
        return handleError(err);
    });

    Song.remove({ artist: artistId }).exec();

    Artist.find({ '_id': artistId }).remove(err => {
        if (err) return res.status(500).send({ message: 'Error petición.' });

        return res.status(200).send({ message: 'Artista eliminado.' });

    })
}

function findByNombre(req, res) {
    var nombre = req.params.query;
    var identity_user_role = req.user.role;
    if (identity_user_role != 'ROLE_ADMIN') {

        return res.status(403).send({ message: 'No tienes acceso.' });

    }


    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;


    Artist.find({ "nombre": { '$regex': nombre, $options: 'i' } }).sort('_id').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!artists) return res.status(404).send({ message: 'No hay artistas disponibles.' });
        return res.status(200).send({
            artists,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });


    });

}

module.exports = {

    artistSave,
    getArtist,
    updateArtist,
    getArtists,
    getArtistsPagination,
    deleteArtist,
    findByNombre


}