'use strict'

var mongoosePagination = require('mongoose-pagination');
var moment = require('moment');


var Message = require('../models/message');
var User = require('../models/user');


function saveMessage(req, res) {
    var params = req.body;

    if (!params.text || !params.receiver) return res.status(200).send({ message: "Enviar datos necesarios." })

    var message = new Message();

    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = false;
    message.notify = false;

    message.save((err, messageStored) => {
        if (err) return res.status(500).send({ message: "Error petición." })

        if (!messageStored) return res.status(404).send({ message: "Error al enviar mensaje." })

        return res.status(200).send({ message: messageStored });
    })
}

function saveMessage100(req, res) {
    User.findOne({ username: 'admin' }, (err, admin) => {
        if (err) return res.status(500).send({ message: "Error petición." })
        if (!admin) return res.status(404).send({ message: "Error al enviar mensaje." })

        var message = new Message();

        message.emitter = admin._id;
        message.receiver = req.user.sub;
        message.text = 'Enhorabuena has llegado a los 100 seguidores!!!'
        message.created_at = moment().unix();
        message.viewed = false;
        message.notify = true;

        message.save((err, messageStored) => {
            if (err) return res.status(500).send({ message: "Error petición." })

            if (!messageStored) return res.status(404).send({ message: "Error al enviar mensaje." })

            return res.status(200).send({ message: messageStored });
        })


    })


}



function getRecMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 5;

    Message.find({ receiver: userId }).sort('-created_at').populate('emitter receiver', 'username email avatar _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({ message: "Error petición." })
        if (!messages) return res.status(404).send({ message: "No hay mensajes." })

        return res.status(200).send({
            messages: messages,
            total: total,
            pages: Math.ceil(total / itemsPerPage)
        })
    })
}

function getSendMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 5;

    Message.find({ emitter: userId }).sort('-created_at').populate('receiver emitter', 'username email avatar _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({ message: "Error petición." })
        if (!messages) return res.status(404).send({ message: "No hay mensajes." })

        return res.status(200).send({
            messages: messages,
            total: total,
            pages: Math.ceil(total / itemsPerPage)
        })
    })
}

function unviewedMessages(req, res) {
    var userId = req.user.sub;

    Message.countDocuments({ receiver: userId, viewed: 'false' }).exec((err, counts) => {
        if (err) return res.status(500).send({ message: "Error petición." })

        return res.status(200).send({ unviewed: counts })

    })
}

function unviewedAndNotifyMessages(req, res) {
    var userId = req.user.sub;

    Message.countDocuments({ receiver: userId, viewed: 'false', notify: 'true' }).exec((err, counts) => {
        if (err) return res.status(500).send({ message: "Error petición." })

        return res.status(200).send({ unnotify: counts })

    })
}

function setViewedMessages(req, res) {
    var userId = req.user.sub;
    var messageId = req.params.id;


    Message.update({ receiver: userId, viewed: 'false', _id: messageId }, { viewed: 'true' }, (err, messageUpdated) => {
        if (err) return res.status(500).send({ message: "Error petición." })
        if (!messageUpdated) return res.status(404).send({ message: "No hay mensajes." })

        return res.status(200).send({ messages: messageUpdated });
    })
}


module.exports = {
    saveMessage,
    getRecMessages,
    getSendMessages,
    unviewedMessages,
    setViewedMessages,
    saveMessage100,
    unviewedAndNotifyMessages

}