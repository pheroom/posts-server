import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import ApiError from "../error/ApiError.js";
import fileService from "../fileService.js";
import mongoose from "mongoose";

class PostController {
    async getAll(req, res, next) {
        try {
            const {limit = 10, page = 1} = req.query
            const offset = page * limit - limit
            const posts = await Post.find({}).skip(offset).limit(limit);
            res.status(200).json(posts)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params.id;
            const post = await Post.findOne({_id: id});
            if(!post){
                return next(ApiError.badRequest(`Пост с ID ${id} не найден.`));
            }
            res.status(200).json(post)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async create(req, res, next) {
        try {
            const user = req.user;
            const {text = ''} = req.body
            const data = {authorId: user.id, text}
            if(req.files && req.files.images && req.files.images.length){
                const files = req.files.images
                const imgs = files.map(img => {
                    if (img.size > 10000000) {
                        return next(ApiError.badRequest("Размер изображения должен быть меньше 1мб."))
                    }
                    return fileService.saveFile(img)
                })
                data.imgs = imgs
            } else if(!text){
                return next(ApiError.badRequest('Содержимое поста не может быть пустым.'))
            }
            const post = await Post.create(data)
            res.status(200).json(post)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async likePost(req, res, next) {
        try {
            const user = req.user;
            const {id} = req.params
            const post = await Post.findOne({_id: id})
            if(!post){
                return next(ApiError.badRequest('Пост с таким ID не найден.'))
            }
            if(post.likes.includes(user.id)){
                return next(ApiError.badRequest('Вы уже оценили этот пост.'))
            }
            post.likes.push(user.id)
            await post.save()
            res.status(200).json(post)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async unlikePost(req, res, next) {
        try {
            const user = req.user;
            const {id} = req.params
            const post = await Post.findOne({_id: id})
            if(!post){
                return next(ApiError.badRequest('Пост с таким ID не найден.'))
            }
            if(!post.likes.includes(user.id)){
                return next(ApiError.badRequest('Вы еще не оценивали этот пост.'))
            }
            post.likes.pull(user.id)
            await post.save()
            res.status(200).json(post)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const user = req.user;
            const {id} = req.params
            const post = await Post.findOne({_id: id})
            if(!post){
                return next(ApiError.badRequest('Пост с таким ID не найден.'))
            }
            if(post.authorId.toString() !== user.id){
                return next(ApiError.badRequest('Вы не можете удалить чужой пост.'))
            }
            await post.deleteOne()
            res.status(200).json(post)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async getComments(req, res, next) {
        try {
            const user = req.user;
            const { id } = req.params
            const post = await Post.findOne({_id: id})
            if(!post){
                return next(ApiError.badRequest('Пост с таким ID не найден.'))
            }
            const comments = await Comment.find({_id: {$in: post.comments}})
            res.status(200).json(comments)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async createComment(req, res, next) {
        try {
            const user = req.user;
            const {id} = req.params
            const post = await Post.findOne({_id: id})
            if(!post){
                return next(ApiError.badRequest('Пост с таким ID не найден.'))
            }
            const idForComment = new mongoose.Types.ObjectId()
            const {text = '', repliedId = idForComment} = req.body
            const data = {authorId: user.id, text, repliedId, _id: idForComment}
            if(req.files && req.files.images && req.files.images.length){
                const files = req.files.images
                const imgs = files.map(img => {
                    if (img.size > 10000000) {
                        return next(ApiError.badRequest("Размер изображения должен быть меньше 1мб."))
                    }
                    return fileService.saveFile(img)
                })
                data.imgs = imgs
            } else if(!text){
                return next(ApiError.badRequest('Содержимое поста не может быть пустым.'))
            }
            const comment = await Comment.create(data)
            post.comments.push(comment._id)
            await post.save()
            res.status(200).json({comment, post})
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async likeComment(req, res, next) {
        try {
            const user = req.user;
            const { cid } = req.params
            const comment = await Comment.findOne({_id: req.params.cid})
            if(!comment){
                return next(ApiError.badRequest('Комментарий с таким ID не найден.'))
            }
            if(comment.likes.includes(user.id)){
                return next(ApiError.badRequest('Вы уже оценили этот комментарий.'))
            }
            comment.likes.push(user.id)
            await comment.save()
            res.status(200).json(comment)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async unlikeComment(req, res, next) {
        try {
            const user = req.user;
            const {cid} = req.params
            const comment = await Comment.findOne({_id: cid})
            if(!comment){
                return next(ApiError.badRequest('Комментарий с таким ID не найден.'))
            }
            if(!comment.likes.includes(user.id)){
                return next(ApiError.badRequest('Вы еще не оценивали этот комментарий.'))
            }
            comment.likes.pull(user.id)
            await comment.save()
            res.status(200).json(comment)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async deleteComment(req, res, next) {
        try {
            const user = req.user;
            const {id, cid} = req.params
            const post = await Post.findOne({_id: id})
            if(!post){
                return next(ApiError.badRequest('Пост с таким ID не найден.'))
            }
            const comment = await Comment.findOne({_id: cid})
            if(!comment){
                return next(ApiError.badRequest('Комментарий с таким ID не найден.'))
            }
            if(comment.authorId.toString() !== user.id){
                return next(ApiError.badRequest('Вы не можете удалить чужой комментарий.'))
            }
            post.comments.pull(cid)
            await post.save()
            await comment.deleteOne()
            res.status(200).json(comment)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

export default new PostController();