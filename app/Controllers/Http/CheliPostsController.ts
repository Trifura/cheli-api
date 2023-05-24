import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CheliPost from 'App/Models/CheliPost'

export default class CheliPostsController {
  public async completeCheliPost({ request, response }: HttpContextContract) {
    const { cheliPostId } = request.params()

    const cheliPost = await CheliPost.query().where('id', cheliPostId).preload('cheli').first()

    if (!cheliPost) return response.status(404).json({ message: 'Cheli post not found' })

    cheliPost.isCompleted = true
    const check = await cheliPost.save()

    response.status(200).json(check)
  }
}
