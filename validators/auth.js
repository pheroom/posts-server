import { check } from 'express-validator'

export const userSignupValidator = [
    check("username").not().isEmpty().withMessage("Username не может быть пустым!"),
    check("username").isLength({min:6, max:16}).withMessage("Username должен быть больше 6 и меньше 16 символов!"),
    check("firstname").not().isEmpty().isLength({max:16}).withMessage("Имя пользователя не может быть пустым или больше 16 симолов!"),
    check('password').isLength({min:4, max:20}).withMessage("Пароль должен быть больше 4 и меньше 20 символов!")
];

export const userSigninValidator = [
    check("username").not().isEmpty().withMessage("Username не может быть пустым!"),
    check("username").isLength({min:6, max:16}).withMessage("Username должен быть больше 6 и меньше 16 символов!"),
    check('password').isLength({min:4, max:20}).withMessage("Пароль должен быть больше 4 и меньше 20 символов!")
];
