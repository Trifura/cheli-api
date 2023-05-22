import jwt, { JwtPayload } from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, Env.get('APP_KEY'))
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, Env.get('APP_KEY')) as JwtPayload
  } catch (err) {
    return null
  }
}
