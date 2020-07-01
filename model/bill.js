const connection = require("../database");

const BillDetails = {
    create: (req, callback) => {
        const {
            idRoom = "",
            dateCheckOut = '',
            totalPrice = 0,
            isCheckedOut = 0,
            codeBill = '',
            idBlock = 0,
            billDetails = [],
        } = req.body;
        let query =
            "INSERT INTO bills (idRoom, dateCheckOut, totalPrice, isCheckedOut, codeBill, idBlock) VALUES (?)";
        let query2 = "INSERT INTO bill_details (code, nameService, price, nameUnit, amount, totalPrice) VALUES ?";

        return connection.getConnection((err, connection) => {
            return connection.beginTransaction((err) => {
                if (err) {
                    console.log(err);
                    return connection.rollback(() => {
                        callback(err);
                    });
                }

                connection.query(
                    query,
                    [
                        [
                            idRoom,
                            dateCheckOut,
                            totalPrice,
                            isCheckedOut,
                            codeBill,
                            idBlock
                        ],
                    ],
                    (err, rows) => {
                        if (err) {
                            return connection.rollback(() => {
                                callback(err);
                            });
                        }

                        connection.query(
                            query2,
                            [
                                billDetails.map((billDetail) => [
                                    codeBill,
                                    billDetail.nameService,
                                    billDetail.price,
                                    billDetail.nameUnit,
                                    billDetail.amount,
                                    billDetail.totalPrice
                                ]),
                            ],
                            (err, rows) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        callback(err);
                                    });
                                }
                                connection.commit(callback);
                            }
                        );
                    }
                );
            });
        })
    },
    createUserRoom: (req, callback) => {
        const { userRooms } = req.body;
        let query = "INSERT INTO user_room (idUser, idRoom) VALUES ?";
        return connection.query(
            query,
            [userRooms.map((userRoom) => [userRoom.idUser, userRoom.idRoom])],
            callback
        );
    },
    getAll: (req, callback) => {
        const { idBlock = "" } = req.query;
        let query =
            "SELECT b.*, r.nameRoom FROM bills b INNER JOIN rooms r ON b.idRoom = r.id where b.idBlock = ? ";
        return connection.query(query, [idBlock], callback);
    },
    delete: (req, callback) => {
        const { id = "" } = req.params;
        let query = "DELETE FROM contracts WHERE id = ?";

        return connection.query(query, [id], callback);
    },
    deleteAll: (req, callback) => {
        const { contractsId } = req.body;

        let query = "DELETE FROM contracts WHERE id IN (?)";

        return connection.query(query, [contractsId], callback);
    },
    update: (req, callback) => {
        const {
            userRooms = [],
            idRoom,
            idSlave,
            startDate,
            endDate,
            circlePay,
            deposit = "",
            dayPay = 0,
            note = "",
        } = req.body;
        const { id = "" } = req.params;
        let query =
            "UPDATE contracts SET idSlave = ?, startDate = ?, endDate = ?, circlePay = ?, deposit = ?, dayPay = ?, note = ? WHERE id = ?";
        let query2 = 'DELETE FROM user_room WHERE idRoom = ?';
        let query3 = 'INSERT INTO user_room (idUser, idRoom) VALUES ?'

        return connection.getConnection((err, connection) => {
            return connection.beginTransaction((err) => {
                if (err) {
                    console.log(err);
                    return connection.rollback(() => {
                        callback(err);
                    });
                }

                connection.query(query, [idSlave, startDate, endDate, circlePay, deposit, dayPay, note, id], (err, rows) => {
                    if (err) {
                        return connection.rollback(() => {
                            callback(err);
                        });
                    }

                    connection.query(query2, [idRoom], (err, rows) => {
                        if (err) {
                            return connection.rollback(() => {
                                callback(err);
                            });
                        }

                        connection.query(query3, [userRooms.map(userRoom => [userRoom.idUser, userRoom.idRoom,])], (err, rows) => {
                            if (err) {
                                return connection.rollback(() => {
                                    callback(err);
                                });
                            }

                            connection.commit(callback);
                        })
                    })
                })
            })
        })
    },
    get: (id, callback) => {
        let query = "SELECT * FROM USERS WHERE id = ?";
        return connection.query(query, [id], callback);
    },
};

module.exports = BillDetails;
