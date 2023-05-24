// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserFollow from 'App/Models/UserFollow'

export default class UserFollowsController {
  public async follow({ request, response }: HttpContextContract) {
    const { userId } = request.all()
    const { followingId } = request.params()

    if (!followingId) {
      return response.status(400).json({ message: 'User is not specified' })
    }

    if (followingId === userId) {
      return response.status(400).json({ message: 'You cannot follow yourself' })
    }

    const followingUser = await User.find(followingId)

    if (!followingUser) {
      return response.status(404).json({ message: 'User is not found' })
    }

    const isFollowed = await UserFollow.query()
      .where('follower_id', userId)
      .andWhere('following_id', followingId)
      .first()

    if (isFollowed) {
      await isFollowed.delete()
      return response.status(200).json({ message: 'User successfully unfollowed' })
    }

    await UserFollow.create({
      followerId: userId,
      followingId,
    })

    return response.status(200).json({ message: 'Follow request successfully sent' })
  }

  public async acceptFollow({ request, response }: HttpContextContract) {
    const { userId } = request.all()
    const { followerId } = request.params()

    if (!followerId) {
      return response.status(400).json({ message: 'User is not specified' })
    }

    console.log(followerId)
    const follower = await User.query().where('id', followerId).first()

    if (!follower) {
      return response.status(404).json({ message: 'User is not found' })
    }

    const followRequest = await UserFollow.query()
      .where('follower_id', followerId)
      .andWhere('following_id', userId)
      .andWhere('is_accepted', false)
      .first()

    if (!followRequest) {
      return response.status(404).json({ message: 'Follow request is not found' })
    }

    followRequest.isAccepted = true
    await followRequest.save()

    return response.status(200).json({ message: 'Follow request successfully accepted' })
  }

  public async getNotifications({ request, response }: HttpContextContract) {
    const { userId } = request.all()
    const notifications = await UserFollow.query()
      .where('following_id', userId)
      .andWhere('is_accepted', false)
      .preload('follower')
      .orderBy('created_at', 'desc')

    console.log(notifications)

    return response.status(200).json(notifications)
  }
}
