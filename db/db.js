var mongoose = require('mongoose');



var db = {};

const withTransaction = async func => {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        await func(session);
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

db.withTransaction = withTransaction;

module.exports = db;
