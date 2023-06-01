import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CheliPost from 'App/Models/CheliPost'
import CheliPostLike from 'App/Models/CheliPostLike'

export default class CheliPostsController {
  public async completeCheliPost({ request, response }: HttpContextContract) {
    const { cheliPostId } = request.params()

    // TODO: check if cheli post expired

    const cheliPost = await CheliPost.query().where('id', cheliPostId).preload('cheli').first()

    if (!cheliPost) return response.status(404).json({ message: 'Cheli post not found' })

    cheliPost.isCompleted = true
    const check = await cheliPost.save()

    response.status(200).json(check)
  }

  public async likeCheliPost({ request, response, userId }: HttpContextContract) {
    const { cheliPostId } = request.params()

    const cheliPost = await CheliPost.query().where('id', cheliPostId).first()

    if (!cheliPost) return response.status(404).json({ message: 'Cheli post not found' })

    if (cheliPost.userId === userId)
      return response.status(400).json({ message: 'You cannot like your own cheli post' })

    const cheliPostLike = await CheliPostLike.query()
      .where('cheli_post_id', cheliPostId)
      .where('user_id', userId)
      .first()

    if (cheliPostLike) {
      await cheliPostLike.delete()
      return response.status(200).json({ message: 'Cheli post unliked' })
    }

    await CheliPostLike.create({
      cheliPostId,
      userId,
    })

    response.status(200).json({ message: 'Cheli post liked' })
  }

  public async getCheliPostLikes({ request, response }: HttpContextContract) {
    const { cheliPostId } = request.params()

    const cheliPost = await CheliPost.query().where('id', cheliPostId).first()

    if (!cheliPost) return response.status(404).json({ message: 'Cheli post not found' })

    const likes = await CheliPostLike.query().where('cheli_post_id', cheliPostId).preload('user')

    response.status(200).json(likes)
  }
}
