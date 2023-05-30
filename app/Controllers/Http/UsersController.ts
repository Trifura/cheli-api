import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

import UserFollow from 'App/Models/UserFollow'
import AppendCheli from '../../../utils/Cheli'

export default class UsersController {
  public async search({ request, response }: HttpContextContract) {
    const { username } = request.qs()
    const { userId } = request.all()

    const users = await User.query()
      .whereILike('username', `%${username}%`)
      .orWhereILike('fullName', `%${username}%`)
      .preload('followers', (query) => {
        query.where('follower_id', userId)
      })
      .limit(10)

    const usersWithIsFollowed = users.map((user) => {
      return {
        ...user.serialize(),
        isFollowing: user.followers[0]?.isAccepted === true,
        isFollowRequestSent: !!user.followers.length,
      }
    })

    return response.status(200).json(usersWithIsFollowed)
  }

  public async getProfile({ request, response }: HttpContextContract) {
    const { userId } = request.params()

    const user = await User.query()
      .where('id', userId)
      .preload('cheliPosts', (query) => {
        query.preload('cheli')
      })
      .preload('followers')
      .preload('following')
      .first()

    if (!user) return response.status(404).json({ message: 'User not found' })

    const userWithIsFollowed = {
      ...user.serialize(),
      isFollowing: user.followers[0]?.isAccepted === true,
      isFollowRequestSent: !!user.followers.length,
    }

    return response.status(200).json(userWithIsFollowed)
  }

  public async getHomeFeed({ request, response }: HttpContextContract) {
    const { userId } = request.all()

    await AppendCheli(userId)

    const user = await User.query()
      .where('id', userId)
      .preload('cheliPosts', (query) => {
        query.preload('cheli')
      })
      .first()

    if (!user) return response.status(404).json({ message: 'User not found' })

    const activeCheli = user.activeCheli

    const followingUsers = await UserFollow.query().where('follower_id', userId)
    const followingUserIds = followingUsers.map((userFollow) => userFollow.followingId)

    const feed = await User.query()
      .whereIn('id', followingUserIds)
      .preload('cheliPosts', (query) => {
        query.preload('cheli')
      })

    return response.status(200).json({ activeCheli, feed })
  }
}
