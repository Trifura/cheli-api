import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Cheli from 'App/Models/Cheli'
import CheliPost from 'App/Models/CheliPost'

export default class CheliPostsController {
  public async create({ request, response }: HttpContextContract) {
    const { userId } = request.all()

    const user = await User.query().where('id', userId).preload('cheliPosts').first()

    if (!user) return response.status(404).json({ message: 'User not found' })

    const usedChelis = user.cheliPosts.map((cheliPost) => cheliPost.cheliId)

    const availableChelis = await Cheli.query().whereNotIn('id', usedChelis)

    const randomIndex = Math.floor(Math.random() * availableChelis.length)

    const randomCheli = availableChelis[randomIndex]

    if (!randomCheli) return response.status(404).json({ message: 'No more new chelis' })

    const cheliPost = await CheliPost.create({
      userId,
      cheliId: randomCheli.id,
    })

    response.status(200).json(cheliPost)
  }

  public async completeCheliPost({ request, response }: HttpContextContract) {
    const { cheliPostId } = request.params()

    const cheliPost = await CheliPost.find(cheliPostId)

    if (!cheliPost) return response.status(404).json({ message: 'Cheli post not found' })

    cheliPost.isCompleted = true
    const check = await cheliPost.save()

    response.status(200).json(check)
  }
}
