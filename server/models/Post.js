import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    title: String,
    content: String,
    file: String, 
    likes: { type: Number, default: 0 },
    comments: [{ text: String }],
});

const Post = model('Post', postSchema);

export default Post;