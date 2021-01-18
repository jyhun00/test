const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
const twitSchema = new mongoose.Schema({
    text: {
        type:String,
        required: true,
    },
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, schemaOptions);

twitSchema.plugin(paginate);



module.exports = mongoose.model('Twit', twitSchema);
