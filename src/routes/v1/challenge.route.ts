import express from 'express'

// Controllers
import { ChallengeController } from '../../controllers'
import { authenticate } from '../../middlewares/auth.middleware'

const router = express.Router()

router.get('/challenge', authenticate, ChallengeController.getChallenge)

export default router
