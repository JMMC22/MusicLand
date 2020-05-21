var assert = require('chai').assert;
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var chai = require('chai');
var User = require('../models/user');

var app = require('../app');

describe('Song Controller', function() {
    chai.use(chaiHttp);
    var url = "http://localhost:3800/api";
    let songId;
    let artistId;
    let token;

    before(function(done) {

        chai.request(url).post('/login').send({ username: 'admin', password: 'admin', gettoken: 'true' }).end(function(err, res) {
            expect(res).to.have.status(200);
            token = res.body.token;
            chai.request(url).post('/artist').send({ nombre: 'testArtist', fechaNacimiento: '2015', imagen: 'user.png', nacionalidad: 'España' }).set('Authorization', token).end(function(err, res) {
                expect(res).to.have.status(200);
                artistId = res.body.artist._id;

            })
            done();
        })


    })


    it('/songs', function(done) {
        chai.request(url).get('/songs').set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/songs/:page', function(done) {
        let page = 1;
        chai.request(url).get('/songs/' + page).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/song', function(done) {
        chai.request(url).post('/song').send({ titulo: 'Test', fechaLanzamiento: '2013-05-05', imagen: 'test.png', url: 'spotify:track:0zivwbvIklasq6jLKUVkZv', artist: artistId }).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            songId = res.body.song._id;
            done();
        })

    })

    it('/songs-search/:query/:page?', function(done) {
        let page = 1;
        let query = "Test"
        chai.request(url).get('/songs-search/' + query + '/' + page).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/update-song', function(done) {
        chai.request(url).put('/update-song/' + songId).send({ titulo: 'TestUPDATE', fechaLanzamiento: '2013-05-05', imagen: 'test.png', url: 'spotify:track:0zivwbvIklasq6jLKUVkZv', artist: artistId }).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/song/:id delete', function(done) {
        chai.request(url).delete('/song/' + songId).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    after(function(done) {
        chai.request(url).delete('/artist/' + artistId).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })




})