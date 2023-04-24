import express from 'express'

// Controllers
import { AuthController } from '../../controllers'
import { authenticate } from '../../middlewares/auth.middleware'

const router = express.Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/me', authenticate, AuthController.me)

export default router
