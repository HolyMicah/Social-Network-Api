const {Schema, model, Types} = require('mongoose');
const moment = require('moment');

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => moment(timestamp).format('MMM DD, YYYY [at] hh:mm a'),
    },
},
{
    toJSON: {
        getters: true,
    },
});

const thoughtsSchema = new Schema ({
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => moment(timestamp).format('MMM DD, YYYY [at] hh:mm a'),
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema],
},
{
    toJSON: {
        getters: true
    },
});

thoughtsSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

const Thoughts = model("Thoughts", thoughtsSchema);

module.exports = Thoughts;