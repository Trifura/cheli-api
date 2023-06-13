import User from 'App/Models/User'
import { DateTime } from 'luxon'
import Cheli from 'App/Models/Cheli'
import CheliPost from 'App/Models/CheliPost'

export default class UserAppendCheliHandler {
  public async run() {
    const users = await User.query().where('isEmailVerified', true).preload('cheliPosts')

    users.forEach((user) => {
      this.appendCheliPost(user)
    })
  }

  public async appendCheliPost(user) {
    if (!user) return { message: 'User not found' }

    const oneDay = 24 * 60 * 60 * 1000

    // Add this half an hour, so we give cron job some time for error
    const halfAnHour = 30 * 60 * 1000

    const cheliDeadline = user?.activeCheli?.createdAt?.toMillis() + oneDay - halfAnHour

    if (DateTime.now().toMillis() < cheliDeadline) return null

    const usedChelis = user.cheliPosts?.map((cheliPost) => cheliPost.cheliId) || []

    const availableChelis = await Cheli.query().whereNotIn('id', usedChelis)

    const randomIndex = Math.floor(Math.random() * availableChelis.length)

    const randomCheli = availableChelis[randomIndex]

    if (!randomCheli) return { message: 'No more new chelis' }

    return await CheliPost.create({
      userId: user.id,
      cheliId: randomCheli.id,
    })
  }
}
