import express from 'express'

// Controllers
import { UserController } from '../../controllers'
import { authenticate } from '../../middlewares/auth.middleware'

const router = express.Router()

router.post('/follow/:followId', authenticate, UserController.followUser)
router.get('/feed/', authenticate, UserController.getFeed)

export default router
