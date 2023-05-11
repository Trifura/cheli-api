import express from 'express'

// Controllers
import { UserController } from '../../controllers'

import { authenticate } from '../../middlewares/auth.middleware'

const router = express.Router()

// router.get('/challenge/', authenticate, UserController.getChallenge)
// router.get('/feed/', authenticate, UserController.getFeed)
router.get('/search/', authenticate, UserController.searchUsers)
router.post('/follow/:followId', authenticate, UserController.followUser)
router.get('/home', authenticate, UserController.getHome)
router.get('/:userId', authenticate, UserController.getUser)

export default router
