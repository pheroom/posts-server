import express from 'express';
import postController from "../controllers/postController.js";
import checkAuth from "../midlleware/checkAuth.js";

const router = express.Router();

router.get('/', postController.getAll)
router.get('/:id', postController.getOne)
router.post('/', checkAuth, postController.create)
router.delete('/:id', checkAuth, postController.delete)
router.put('/:id/like', checkAuth, postController.likePost)
router.put('/:id/unlike', checkAuth, postController.unlikePost)
router.get('/:id/comments', checkAuth, postController.getComments)
router.post('/:id/comments', checkAuth, postController.createComment)
router.delete('/:id/comments/:cid', checkAuth, postController.deleteComment)
router.put('/comments/:cid/like', checkAuth, postController.likeComment)
router.put('/comments/:cid/unlike', checkAuth, postController.unlikeComment)

export default router;