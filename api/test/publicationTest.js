var assert = require('chai').assert;
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var chai = require('chai');
var User = require('../models/user');

var app = require('../app');

describe('Publication Controller', function() {
    chai.use(chaiHttp);
    var url = "http://localhost:3800/api";
    let userId;
    let artistId;
    let token;
    let songId;
    let pubId;

    before(function(done) {

        chai.request(url).post('/login').send({ username: 'admin', password: 'admin', gettoken: 'true' }).end(function(err, res) {
            expect(res).to.have.status(200);
            token = res.body.token;
        })

        setTimeout(function() {
            try {
                chai.request(url).post('/artist').send({ nombre: 'testArtista', fechaNacimiento: '2015', imagen: 'user.png', nacionalidad: 'España' }).set('Authorization', token).end(function(err, res) {
                    expect(res).to.have.status(200);
                    artistId = res.body.artist._id;
                    chai.request(url).post('/song').send({ titulo: 'TestPub', fechaLanzamiento: '2013-05-05', imagen: 'test.png', url: 'spotify:track:0zivwbvIklasq6jLKUVkZv', artist: artistId }).set('Authorization', token).end(function(err, res) {
                        expect(res).to.have.status(200);
                        songId = res.body.song._id;
                    })
                    done();
                })

            } catch (e) {
                done(e);
            }
        }, 500);

    })


    it('/publications/:page', function(done) {
        chai.request(url).get('/publications').set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/publication', function(done) {
        chai.request(url).post('/publication').send({ song: songId }).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            pubId = res.body.publication._id;
            done();
        })

    })

    it('/get-top3', function(done) {
        chai.request(url).get('/get-top3songs').set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/publication', function(done) {

        chai.request(url).delete('/publication/' + pubId).set('Authorization', token).end(function(err, res) {
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