// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

import { generateToken } from '../../../utils/Auth'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const validations = await schema.create({
      fullName: schema.string(),
      email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string({}, [rules.confirmed('confirmPassword')]),
      username: schema.string({}, [rules.unique({ table: 'users', column: 'username' })]),
    })

    const data = await request.validate({ schema: validations })
    const user = await User.create(data)

    return response.created(user)
  }

  // login function
  public async login({ request, response }: HttpContextContract) {
    const password = await request.input('password')
    const email = await request.input('username')

    const user = await User.query().where('username', email).first()

    if (!user) return response.status(400).json({ message: 'Invalid Credentials' })

    const isPasswordValid = await Hash.verify(user.password, password)

    if (!isPasswordValid) return response.status(400).json({ message: 'Invalid Credentials' })

    if (!user.isEmailVerified)
      return response.status(400).json({ message: 'Please verify your email' })

    const token = generateToken(user.id)

    return response.json({ token })
  }

  public async me({ request, response }: HttpContextContract) {
    const { userId } = request.all()
    const user = await User.query()
      .where('id', userId)
      .preload('cheliPosts', (query) => {
        query.preload('cheli')
      })
      .preload('followers')
      .preload('following')
      .first()

    if (!user) return response.status(404).json({ message: 'User not found' })

    return response.json(user)
  }
}
