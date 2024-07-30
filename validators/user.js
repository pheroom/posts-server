import { check } from 'express-validator'

export const updateUserDataValidator = [
    check("username").optional().isLength({min:6, max:16}).withMessage("Username должен быть больше 6 и меньше 16 символов!"),
    check("firstname").optional().isLength({max:16}).withMessage("Имя пользователя не может быть пустым или больше 16 симолов!"),
    check("lastname").optional().isLength({max:16}).withMessage("Фамилия пользователя не может быть больше 16 симолов!"),
    check("description").optional().isLength({max:40}).withMessage("Описание аккаунта не может быть длиннее 40 символов!"),
];