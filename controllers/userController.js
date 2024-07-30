import User from "../models/User.js";
import ApiError from "../error/ApiError.js";
import fileService from "../fileService.js";
import Post from "../models/Post.js";

class UserController {
    async getAll(req, res, next) {
        try {
            const {limit = 10, page = 1} = req.query
            const offset = page * limit - limit
            const users = await User.find({}, { password: 0, blacklist: 0 }).skip(offset).limit(limit);
            res.status(200).json(users)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            const user = await User.findOne({_id: id}, { password: 0, blacklist: 0 });
            if(!user){
                return next(ApiError.badRequest(`Аккаунт с ID ${id} не найден.`));
            }
            res.status(200).json(user)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const {username, firstname, lastname = '', description = ''} = req.body;
            const {id} = req.user;
            const user = await User.findOne({_id: id});
            const updates = {firstname, lastname, description}
            if(username){
                const candidate = await User.findOne({username})
                if (candidate && candidate._id !== user.id) {
                    return next(ApiError.badRequest("Пользователь с таким именем уже существует!"))
                }
                updates.username = username
            }
            updates.firstname = updates.firstname || user.firstname
            if(req.files && req.files.img){
                const {img} = req.files
                if (img.size > 10000000) {
                    return next(ApiError.badRequest("Размер изображения должен быть меньше 1мб."))
                }
                updates.avatar = fileService.saveFile(img)
            }
            await user.updateOne(updates)
            const updatedUser = await User.findOne({_id: id});
            res.status(200).json(updatedUser)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            const user = await User.findOne({_id: id});
            if(!user){
                return next(ApiError.badRequest(`Аккаунт с ID ${id} не найден.`));
            }
            await user.deleteOne()
            res.status(200).json(user)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async addFollowing(req, res, next) {
        try {
            const {id: userId} = req.user
            const {id: followingUserId} = req.params;
            const user = await User.findOne({_id: userId});
            if(!user){
                return next(ApiError.badRequest(`Аккаунт с ID ${userId} не найден.`));
            }
            if(user.subscriptions.includes(followingUserId)){
                return next(ApiError.badRequest(`Вы уже подписались на этот аккаунт.`));
            }
            const followingUser = await User.findOne({_id: followingUserId})
            if(!followingUser){
                return next(ApiError.badRequest(`Аккаунт с ID ${followingUserId} не найден.`));
            }
            if(followingUser.followers.includes(userId)){
                return next(ApiError.badRequest(`Вы уже подписались на этот аккаунт.`));
            }
            user.subscriptions.push(followingUserId)
            followingUser.followers.push(userId)
            await user.save()
            await followingUser.save()
            res.status(200).json({user, followingUser})
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async removeFollowing(req, res, next) {
        try {
            const {id: userId} = req.user
            const {id: followingUserId} = req.params;
            const user = await User.findOne({_id: userId});
            if(!user){
                return next(ApiError.badRequest(`Аккаунт с ID ${userId} не найден.`));
            }
            if(!user.subscriptions.includes(followingUserId)){
                return next(ApiError.badRequest(`Вы еще не подписались на этот аккаунт.`));
            }
            const followingUser = await User.findOne({_id: followingUserId})
            if(!followingUser){
                return next(ApiError.badRequest(`Аккаунт с ID ${followingUserId} не найден.`));
            }
            if(!followingUser.followers.includes(userId)){
                return next(ApiError.badRequest(`Вы еще не подписались на этот аккаунт.`));
            }
            user.subscriptions.pull(followingUserId)
            followingUser.followers.pull(userId)
            await user.save()
            await followingUser.save()
            res.status(200).json({user, followingUser})
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async addFavourites(req, res, next) {
        try {
            const {id} = req.user
            const {pid} = req.params;
            const user = await User.findOne({_id: id});
            if(!user){
                return next(ApiError.badRequest(`Аккаунт с ID ${id} не найден.`));
            }
            if(user.favourites.includes(pid)){
                return next(ApiError.badRequest(`Вы уже добавили этот пост в избранное.`));
            }
            const post = await Post.findOne({_id: pid})
            if(!post){
                return next(ApiError.badRequest('Пост с таким ID не найден.'))
            }
            user.favourites.push(pid)
            await user.save()
            res.status(200).json(user)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async removeFavourites(req, res, next) {
        try {
            const {id} = req.user
            const {pid} = req.params;
            const user = await User.findOne({_id: id});
            if(!user){
                return next(ApiError.badRequest(`Аккаунт с ID ${id} не найден.`));
            }
            if(!user.favourites.includes(pid)){
                return next(ApiError.badRequest(`Вы еще не добавили этот пост в избранное.`));
            }
            const post = await Post.findOne({_id: pid})
            if(!post){
                return next(ApiError.badRequest('Пост с таким ID не найден.'))
            }
            user.favourites.pull(pid)
            await user.save()
            res.status(200).json(user)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async blockUser(req, res, next) {
        try {
            const {id: userId} = req.user
            const {id: blockUserId} = req.params;
            const user = await User.findOne({_id: userId});
            if(!user){
                return next(ApiError.badRequest(`Аккаунт с ID ${userId} не найден.`));
            }
            if(user.blacklist.includes(blockUserId)){
                return next(ApiError.badRequest(`Вы уже заблокировали этот аккаунт.`));
            }
            const blockUser = await User.findOne({_id: blockUserId})
            if(!blockUser){
                return next(ApiError.badRequest(`Аккаунт с ID ${blockUserId} не найден.`));
            }
            user.blacklist.push(blockUserId)
            await user.save()
            res.status(200).json({user, blockUser})
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async unblockUser(req, res, next) {
        try {
            const {id: userId} = req.user
            const {id: blockUserId} = req.params;
            const user = await User.findOne({_id: userId});
            if(!user){
                return next(ApiError.badRequest(`Аккаунт с ID ${userId} не найден.`));
            }
            if(!user.blacklist.includes(blockUserId)){
                return next(ApiError.badRequest(`Вы еще не блокировали этот аккаунт.`));
            }
            const blockUser = await User.findOne({_id: blockUserId})
            if(!blockUser){
                return next(ApiError.badRequest(`Аккаунт с ID ${blockUserId} не найден.`));
            }
            user.blacklist.pull(blockUserId)
            await user.save()
            res.status(200).json({user, blockUser})
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

export default new UserController();