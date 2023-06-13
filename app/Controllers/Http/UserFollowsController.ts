// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserFollow from 'App/Models/UserFollow'

export default class UserFollowsController {
  public async follow({ request, response, userId }: HttpContextContract) {
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

  public async acceptFollow({ request, response, userId }: HttpContextContract) {
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

    const data = await UserFollow.query()
      .where('following_id', userId)
      .andWhere('is_accepted', false)
      .preload('follower')
      .orderBy('created_at', 'desc')

    return response.status(200).json(data)
  }

  public async deleteFollow({ request, response, userId }: HttpContextContract) {
    const { followerId } = request.params()

    if (!followerId) {
      return response.status(400).json({ message: 'User is not specified' })
    }

    const followerUser = await User.find(followerId)

    if (!followerUser) {
      return response.status(404).json({ message: 'User is not found' })
    }

    const isFollowed = await UserFollow.query()
      .where('follower_id', followerId)
      .andWhere('following_id', userId)
      .andWhere('is_accepted', false)
      .first()

    if (!isFollowed) {
      return response.status(404).json({ message: 'There is not a follow request from this user' })
    }

    await isFollowed.delete()

    const data = await UserFollow.query()
      .where('following_id', userId)
      .andWhere('is_accepted', false)
      .preload('follower')
      .orderBy('created_at', 'desc')

    return response.status(200).json(data)
  }

  public async getNotifications({ response, userId }: HttpContextContract) {
    const notifications = await UserFollow.query()
      .where('following_id', userId)
      .andWhere('is_accepted', false)
      .preload('follower')
      .orderBy('created_at', 'desc')

    return response.status(200).json(notifications)
  }
}
