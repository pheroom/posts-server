import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config'
import Role from "../models/Role.js";
import ApiError from "../error/ApiError.js";

const generateAccessToken = (id, username, roles) => {
    const payload = { id, username, roles }
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "30d"} )
}

class AuthController {
    async registration(req, res, next) {
        const {username, password, firstname} = req.body
        const candidate = await User.findOne({username})
        if (candidate) {
            return next(ApiError.badRequest("Пользователь с таким именем уже существует!"))
        }
        const hashPassword = await bcrypt.hash(password, 6)
        const userRole = await Role.findOne({value: "USER"})
        const user = new User({username, password: hashPassword, firstname, roles: [userRole.value]})
        await user.save()
        const token = generateAccessToken(user._id, username, user.roles)
        return res.json({token, user})
    }

    async login(req, res, next) {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user) {
            return next(ApiError.badRequest(`Пользователь ${username} не найден!`))
        }
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            return next(ApiError.badRequest(`Введен неверный пароль!`))
        }
        const token = generateAccessToken(user._id, user.username, user.roles)
        return res.json({token, user})
    }

    async check(req, res, next) {
        const token = generateAccessToken(req.user.id, req.user.username, req.user.roles)
        return res.json({token})
    }

    async usersHandler(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }
}

export default new AuthController();