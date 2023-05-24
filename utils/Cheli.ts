import User from 'App/Models/User'
import { DateTime } from 'luxon'
import Cheli from 'App/Models/Cheli'
import CheliPost from 'App/Models/CheliPost'

export default async function AppendCheli(userId: string) {
  const user = await User.query().where('id', userId).preload('cheliPosts').first()

  if (!user) return { message: 'User not found' }

  const oneDay = 24 * 60 * 60 * 1000
  const cheliDeadline = user.activeCheli?.createdAt?.toMillis() + oneDay

  if (user.activeCheli && DateTime.now().toMillis() < cheliDeadline) return null

  const usedChelis = user.cheliPosts.map((cheliPost) => cheliPost.cheliId)

  const availableChelis = await Cheli.query().whereNotIn('id', usedChelis)

  const randomIndex = Math.floor(Math.random() * availableChelis.length)

  const randomCheli = availableChelis[randomIndex]

  if (!randomCheli) return { message: 'No more new chelis' }

  return await CheliPost.create({
    userId,
    cheliId: randomCheli.id,
  })
}
