import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async search({ request, response }: HttpContextContract) {
    const { username } = request.qs()

    const users = await User.query()
      .whereILike('username', `%${username}%`)
      .orWhereILike('fullName', `%${username}%`)
      .limit(10)

    return response.status(200).json(users)
  }

  public async getProfile({ request, response }: HttpContextContract) {
    const { userId } = request.params()

    const user = await User.find(userId)

    if (!user) return response.status(404).json({ message: 'User not found' })

    return response.status(200).json(user)
  }

  public async getHomeFeed({ request, response }: HttpContextContract) {
    const { userId } = request.all()

    const user = await User.query().where('id', userId).preload('cheliPosts').first()

    return response.status(200).json(user)
  }
}
