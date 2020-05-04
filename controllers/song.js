'use strict'

var mongoosePagination = require('mongoose-pagination');
var moment = require('moment');
var fs = require('fs');
var path = require('path');

var Song = require('../models/song');
var Artist = require('../models/artist');


function songSave(req, res) {
    var params = req.body;
    console.log(params)

    var identity_user_role = req.user.role;
    if (identity_user_role != 'ROLE_ADMIN') {

        return res.status(403).send({ message: 'No tienes acceso.' });

    }


    var song = new Song();

    song.titulo = params.titulo;
    song.fechaLanzamiento = params.fechaLanzamiento;
    song.imagen = params.imagen;
    song.artist = params.artist;
    song.url = params.url.substr(14);



    song.save((err, songStored) => {

        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!songStored) return res.status(404).send({ message: 'No se ha podido guardar la canción.' });

        return res.status(200).send({ song: songStored });
    })
}

function getSongs(req, res) {

    Song.find().sort('_id').exec((err, songs) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!songs) return res.status(404).send({ message: 'No hay canciones disponibles.' });


        return res.status(200).send({ songs });

    });
}

// paginados
function getSongsPagination(req, res) {

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    Song.find().sort('titulo').populate('artist').paginate(page, itemsPerPage, (err, songs, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!songs) return res.status(404).send({ message: 'No hay canciones disponibles.' });

        return res.status(200).send({
            songs,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });

}

function getSong(req, res) {
    var songId = req.params.id;

    Song.findById(songId, (err, song) => {
        if (err) return res.status(500).send({ message: 'Error petición.' });

        if (!song) return res.status(404).send({ message: 'La canción no existe.' });

        return res.status(200).send({
            song: song
        })

    })
}

//Editar canción

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;
    var identity_user_role = req.user.role;
    if (identity_user_role != 'ROLE_ADMIN') {

        return res.status(403).send({ message: 'No tienes acceso.' });

    }

    Song.findByIdAndUpdate(songId, update, { new: true }, (err, songUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la petición.' });

        if (!songUpdated) return res.status(404).send({ message: 'No se ha podido actualizar la canción.' });

        return res.status(200).send({ song: songUpdated });
    })
}

function deleteSong(req, res) {
    var songId = req.params.id;

    var identity_user_role = req.user.role;
    if (identity_user_role != 'ROLE_ADMIN') {

        return res.status(403).send({ message: 'No tienes acceso.' });

    }

    Song.find({ '_id': songId }).remove(err => {
        if (err) return res.status(500).send({ message: 'Error petición.' });
        //if (!publicationRemoved) return res.status(404).send({ message: 'La publicación no se ha eliminado.' });

        return res.status(200).send({ message: 'Canción eliminada.' });

    })
}

function findByTituloAndArtista(req, res) {
    var query = req.params.query;

    console.log(req.params)

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    getArtistsSongs(query).then((value) => {
        console.log(value)

        Song.find({
            $or: [
                { "titulo": { $regex: query, $options: 'i' } },
                { "artist": { "$in": value.artists } }
            ]
        }).populate('artist').sort('titulo').paginate(page, itemsPerPage, (err, songs, total) => {
            if (err) return res.status(500).send({ message: 'Error en la petición.' });


            if (!songs) return res.status(404).send({ message: 'No hay canciones disponibles.' });

            return res.status(200).send({
                songs,
                total,
                pages: Math.ceil(total / itemsPerPage)
            });


        });




    })
}

async function getArtistsSongs(query) {
    var songs = await Song.find().exec().then((songs) => {
        return songs;
    }).catch((err) => {
        return handleError(err);
    });

    //Procesando artists que tienen cancion
    var artists = [];

    songs.forEach((song) => {
        artists.push(song.artist);
    });

    var artistWithSong = await Artist.find({ $and: [{ "_id": { "$in": artists } }, { "nombre": { $regex: query, $options: 'i' } }] }).exec()
        .then((artistsN) => {
            return artistsN;
        }).catch((err) => {
            return handleError(err);
        });

    var artists_clean = [];

    artistWithSong.forEach((art) => {
        artists_clean.push(art._id);
    });


    return {
        artists: artists_clean
    }
}


module.exports = {

    songSave,
    getSongs,
    getSongsPagination,
    getSong,
    updateSong,
    deleteSong,
    findByTituloAndArtista

}