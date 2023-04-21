import express from 'express'

// Controllers
import { UserController } from '../../controllers'
import { authenticate } from '../../middlewares/auth.middleware'

const router = express.Router()

router.get('/challenge', authenticate, UserController.getChallenge)

export default router
