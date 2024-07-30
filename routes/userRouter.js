import express from 'express';
import userController from "../controllers/userController.js";
import checkAuth from "../midlleware/checkAuth.js";
import checkRoles from "../midlleware/checkRoles.js";
import {updateUserDataValidator} from "../validators/user.js";
import {runValidation} from "../validators/index.js";

const router = express.Router();

router.get('/', userController.getAll)
router.get('/:id', userController.getOne)
router.put('/', checkAuth, updateUserDataValidator, runValidation, userController.update)
router.delete('/:id', checkRoles(['ADMIN']), userController.delete)
router.put('/:id/follow', checkAuth, updateUserDataValidator, runValidation, userController.addFollowing)
router.put('/:id/unfollow', checkAuth, updateUserDataValidator, runValidation, userController.removeFollowing)
router.put('/favourites/:pid', checkAuth, updateUserDataValidator, runValidation, userController.addFavourites)
router.put('/unfavourites/:pid', checkAuth, updateUserDataValidator, runValidation, userController.removeFavourites)
router.put('/:id/block', checkAuth, updateUserDataValidator, runValidation, userController.blockUser)
router.put('/:id/unblock', checkAuth, updateUserDataValidator, runValidation, userController.unblockUser)

export default router;