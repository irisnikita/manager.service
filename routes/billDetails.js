// router
const express = require('express');
const billDetailsRouters = express.Router();
const authMiddleware = require('../Middleware/AuthMiddleware');
const connection = require('../database');
const { redisContract } = require('../Middleware/Redis')
const redis_client = require('../redis');

// Model
const contractModel = require('../model/contract');
const roomImageModel = require('../model/roomImage');
const billDetailsModel = require('../model/bill');


const billDetailsRouter = (app) => {
    billDetailsRouters.use(authMiddleware.isAuth)

    billDetailsRouters.get('/get-bills',(req, res) => {
        billDetailsModel.getAll(req, (err, rows) => {
            if (!err) {
                res.json({
                    message: 'success',
                    data: {
                        bills: rows
                    }
                })
            } else {
                res.json({
                    message: err
                })
            }
        })
    })

    billDetailsRouters.post('/create', (req, res) => {
        billDetailsModel.create(req, (err, rows) => {
            if (!err) {
                res.send({
                    status: res.statusCode,
                    message: 'Create contract success',
                    data: {
                        status: 1
                    }
                })
            } else {
                res.send({
                    message: err
                })
            }
        })
    })

    billDetailsRouters.post('/create-user-room', (req, res) => {
        redis_client.del(`customers:${req.query.userId}`)
        contractModel.create(req, (err, rows) => {
            if (!err) {
                res.send({
                    status: res.statusCode,
                    message: 'Create userRoom success',
                    data: {
                        status: 1
                    }
                })
            } else {
                res.send({
                    message: err
                })
            }
        })
    })

    billDetailsRouters.delete('/delete/:id', (req, res) => {
        redis_client.del(`contracts:${req.query.idBlock}`)
        redis_client.del(`customers:${req.query.userId}`)

        contractModel.delete(req, (err, rows) => {
            if (!err) {
                res.send({
                    status: res.statusCode,
                    message: 'Delete contract success',
                    data: {
                        status: 1
                    }
                })
            } else {
                res.send({
                    message: 'Can\'t delete contract'
                })
            }
        })
    })

    billDetailsRouters.put('/update/:id', (req, res) => {
        redis_client.del(`contracts:${req.body.idBlock}`)
        redis_client.del(`customers:${req.query.userId}`)

        contractModel.update(req, (err, rows) => {
            if (!err) {
                res.send({
                    status: res.statusCode,
                    message: 'Update contract success',
                    data: {
                        status: 1
                    }
                })
            } else {
                res.send({
                    message: err
                })
            }
        })
    })

    billDetailsRouters.post('/delete-all', (req, res) => {
        redis_client.del(`contracts:${req.body.idBlock}`)
        redis_client.del(`customers:${req.query.userId}`)

        contractModel.deleteAll(req, (err, rows) => {
            if (!err) {
                res.send({
                    status: res.statusCode,
                    message: 'Delete contracts success',
                    data: {
                        status: 1
                    }
                })
            } else {
                res.send({
                    message: err
                })
            }
        })
    })

    billDetailsRouters.post('/uploadImage', (req, res) => {
        roomImageModel.create(req, (err, rows, fields) => {
            if (!err) {
                res.send({
                    status: res.statusCode,
                    message: 'Upload images success',
                    data: {
                        status: 1
                    }
                })
            } else {
                res.send({
                    message: err
                })
            }
        })
    })

    billDetailsRouters.get('/get-images', (req, res) => {
        roomImageModel.getAll(req.query.codeRoom, (err, rows, fields) => {
            if (!err) {
                res.send({
                    status: res.statusCode,
                    message: 'get images success',
                    data: {
                        images: rows
                    }
                })
            } else {
                res.send({
                    message: err
                })
            }
        })
    })

    billDetailsRouters.post('/delete-images', (req, res) => {
        roomImageModel.deleteAll(req, (err, rows, fields) => {
            if (!err) {
                res.send({
                    status: res.statusCode,
                    message: 'Delete images success',
                    data: {
                        images: rows
                    }
                })
            } else {
                res.send({
                    message: err
                })
            }
        })
    })

    app.use('/bill', billDetailsRouters);
}

module.exports = billDetailsRouter;