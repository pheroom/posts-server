import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, trim: true, unique: true, required: true},
    firstname: {type: String, trim: true, required: true},
    lastname: {type: String, trim: true, default: ''},
    description: {type: String, trim: true, default: ''},
    password: {type: String, required: true},
    avatar: {type: String, default: ''},
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: "User",}],
    subscriptions: [{type: mongoose.Schema.Types.ObjectId, ref: "User",}],
    blacklist: [{type: mongoose.Schema.Types.ObjectId, ref: "User",}],
    favourites: [{type: mongoose.Schema.Types.ObjectId, ref: "Post",}],
    roles: [{type: String, ref: "Role"}],
    createdAt: {type: Date, default: Date.now},
});

export default mongoose.model('User', userSchema);
