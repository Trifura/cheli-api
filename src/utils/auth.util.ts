import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10)
}

export async function comparePassword(
	password: string,
	hashedPassword: string
): Promise<boolean> {
	return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: number): string {
	return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JwtPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as JwtPayload
	} catch (err) {
		return null
	}
}
