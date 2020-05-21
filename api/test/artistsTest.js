var assert = require('chai').assert;
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var chai = require('chai');
var User = require('../models/user');

var app = require('../app');

describe('Artist Controller', function() {
    chai.use(chaiHttp);
    var url = "http://localhost:3800/api";
    let userId;
    let artistId;
    let token;

    before(function(done) {

        chai.request(url).post('/login').send({ username: 'admin', password: 'admin', gettoken: 'true' }).end(function(err, res) {
            expect(res).to.have.status(200);
            token = res.body.token;
            done();
        })

    })


    it('/all-artists', function(done) {
        chai.request(url).get('/all-artists').set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/artists/:page?', function(done) {
        let page = 1;
        chai.request(url).get('/artists/' + page).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/artist', function(done) {
        chai.request(url).post('/artist').send({ nombre: 'testArtist', fechaNacimiento: '2015', imagen: 'user.png', nacionalidad: 'España' }).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            artistId = res.body.artist._id;
            done();
        })

    })

    it('/update-artist/:id', function(done) {
        chai.request(url).put('/update-artist/' + artistId).send({ nombre: 'testArtist', fechaNacimiento: '2015', imagen: 'user.png', nacionalidad: 'EspañaEdit' }).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/search-artist/:query/:page?', function(done) {
        let query = 'testArtist';
        chai.request(url).get('/search-artist/' + query).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/artist/:id', function(done) {
        chai.request(url).get('/artist/' + artistId).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/artist/:id delete', function(done) {
        chai.request(url).delete('/artist/' + artistId).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })




    /*
    after(function(done) {

        chai.request(url).post('/login').send({ username: 'admin', password: 'admin', gettoken: 'true' }).end(function(err, res) {
            expect(res).to.have.status(200);

            chai.request(url).delete('/user/' + userId).set('Authorization', res.body.token).end(function(err, res) {
                expect(res).to.have.status(200);
            })
            done();
        })


    })*/


})