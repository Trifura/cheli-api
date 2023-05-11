import express from 'express'
import { authenticate } from '../../middlewares/auth.middleware'
import { ChallengeController } from '../../controllers'

// Controllers
const router = express.Router()

router.post(
	'/complete/:userChallengeId',
	authenticate,
	ChallengeController.completeChallenge
)

export default router
