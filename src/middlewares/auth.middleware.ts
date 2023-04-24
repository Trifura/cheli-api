// src/auth/middleware.ts
import { Response, NextFunction } from 'express'
import { verifyToken } from '../utils/auth.util'

export function authenticate(req: any, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization

	if (!authHeader) {
		return res
			.status(401)
			.json({ message: 'Authorization header is missing' })
	}

	const token = authHeader.split(' ')[1]

	if (!token) {
		return res.status(401).json({ message: 'Token is missing' })
	}

	const decoded = verifyToken(token)

	if (!decoded) {
		return res.status(401).json({ message: 'Invalid or expired token' })
	}

	req.userId = decoded.id
	next()
}
