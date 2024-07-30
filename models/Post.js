import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    authorId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    text: {type: String, trim: true, default: ''},
    imgs: [String],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    // comments: [[
    //     {
    //         id: {type: mongoose.Schema.Types.ObjectId, required: true},
    //         authorId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    //         text: {type: String, trim: true, default: ''},
    //         imgs: [String],
    //         likes: {type: Number, default: 0},
    //         repliedId: {type: mongoose.Schema.Types.ObjectId, default: null},
    //         createdAt: {type: Date, default: Date.now},
    //     }
    // ]],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    views: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now},
});

export default mongoose.model('Post', postSchema);
