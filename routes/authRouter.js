import express from 'express';
import authController from "../controllers/authController.js";
import { userSignupValidator, userSigninValidator } from "../validators/auth.js";
import { runValidation } from "../validators/index.js";
import checkAuth from "../midlleware/checkAuth.js";
import checkRoles from "../midlleware/checkRoles.js";

const router = express.Router();

router.post('/registration', userSignupValidator, runValidation, authController.registration)
router.post('/login', userSigninValidator, runValidation, authController.login)
router.get('/check', checkAuth, authController.check)
router.get('/users', checkRoles(['ADMIN']), authController.usersHandler)

export default router;