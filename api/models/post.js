const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        postedBy: {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            maxLength: 500,
        },
        img: {
            type: String,
        },
    }, { timestamps: true }
);

const post = mongoose.model('Post', postSchema);
module.exports = post;