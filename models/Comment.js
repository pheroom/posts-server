import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    authorId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    text: {type: String, trim: true, default: ''},
    imgs: [String],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    repliedId: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
    createdAt: {type: Date, default: Date.now},
});

export default mongoose.model('Comment', postSchema);
