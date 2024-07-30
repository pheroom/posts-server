import jwt from 'jsonwebtoken'
import 'dotenv/config'
import ApiError from "../error/ApiError.js";

const authMiddleware = (roles) => (req, res, next) => {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return next(ApiError.badRequest('Вы не авторизованы.'))
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        let hasRole = false
        decoded.roles.forEach(role => {
            if (roles.includes(role)) {
                hasRole = true
            }
        })
        if (!hasRole) {
            next(ApiError.forbidden('У вас нет доступа.'))
        }
        req.user = decoded
        next()
    } catch (e) {
        next(ApiError.badRequest('Вы не авторизованы.'))
    }
};

export default authMiddleware