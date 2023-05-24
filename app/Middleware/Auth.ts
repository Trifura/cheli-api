import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { verifyToken } from '../../utils/Auth'

export default class Auth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const authorization = request.headers().authorization

    if (!authorization) {
      return response.status(401).json({ message: 'Authorization header is missing' })
    }

    const token = authorization.split(' ')[1]

    if (!token) {
      return response.status(401).json({ message: 'Token is missing' })
    }

    const verifiedToken = verifyToken(token)

    if (!verifiedToken) {
      return response.status(401).json({ message: 'Invalid or expired token' })
    }

    request.all().userId = verifiedToken.userId

    await next()
  }
}
