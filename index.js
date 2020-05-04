'use strict'

var User = require('./models/user');
var Artist = require('./models/artist');
var Song = require('./models/song');

var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var neatCsv = require('neat-csv');



var mongoose = require('mongoose');
var app = require('./app');

var port = 3800;

/*var port = process.env.PORT || 8080;*/

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/musicland', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log("La conexión con la base de datos se ha realizado correctamente")

        loadInitialData();
        //Crear servidor
        app.listen(port, () => {
            console.log("Server running port 3800")
        });
    })
    .catch(err => console.log(err));

async function loadInitialData() {

    const users = await User.find().exec();
    if (users.length !== 0) {
        // Data exists, no need to seed.
        return;
    }

    bcrypt.hash("user", null, null, (err, hash) => {
        const user1 = new User({ username: 'user', email: 'user@email.com', password: hash, role: 'ROLE_USER', avatar: 'user.png' });
        user1.save();
    });

    bcrypt.hash("admin", null, null, (err, hash) => {
        const user1 = new User({ username: 'admin', email: 'admin@email.com', password: hash, role: 'ROLE_ADMIN', avatar: 'user.png' });
        user1.save();
    });

    bcrypt.hash("josmarcre", null, null, (err, hash) => {
        const user1 = new User({ username: 'josmarcre', email: 'josmarcre@email.com', password: hash, role: 'ROLE_USER', avatar: 'user.png' });
        user1.save();
    });
    console.log("La base de datos se ha populado correctamente con Usuarios.")


    artists();
    setTimeout(function() {
        songs()
    }, 3000);



}
//Artistas
async function artists() {
    fs.readFile('./datasets/artistas.csv', async(err, data) => {
        if (err) {
            console.error(err)
            return
        }
        var cont = 1;
        await (await neatCsv(data)).forEach(element => {
            const art = new Artist({
                nombre: element[0],
                fechaNacimiento: element[1],
                nacionalidad: element[2],
                imagen: element[3]
            });
            cont++;
            art.save();
        })
        console.log("La base de datos se ha populado correctamente con Artistas.")

    })
}

async function songs() {

    //Canciones
    fs.readFile('./datasets/canciones.csv', async(err, data) => {
        if (err) {
            console.error(err)
            return
        }
        var cont = 1;

        await (await neatCsv(data)).forEach(element => {
            try {
                Artist.findOne({ nombre: element[3] }).exec().then((artistOne) => {

                    const song = new Song({
                        titulo: element[0],
                        fechaLanzamiento: element[1],
                        imagen: element[2],
                        url: element[4].substr(14),
                        artist: artistOne._id
                    });
                    cont++;
                    song.save();

                })

            } catch (error) {
                console.log(error);
                next(error);

            }
        })
        console.log("La base de datos se ha populado correctamente con Canciones.")


    })



};