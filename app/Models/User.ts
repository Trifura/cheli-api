import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  column,
  computed,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import CheliPost from 'App/Models/CheliPost'
import Hash from '@ioc:Adonis/Core/Hash'

import { v4 as uuidv4 } from 'uuid'
import UserFollow from 'App/Models/UserFollow'
import { formatDateTime } from '../../utils/Time'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public fullName: string

  @computed()
  public get initials() {
    const nameParts = this.fullName.trim().split(/\s+/)

    if (nameParts.length <= 0 || !nameParts[0]) {
      return ''
    }

    if (nameParts.length === 1) {
      // If there's only one word, return the first 2 characters.
      return nameParts[0]?.substring(0, 2).toUpperCase()
    }

    // If there are multiple words, return the first character of the first word
    // and the first character of the last word.
    const firstInitial = nameParts[0].charAt(0)
    const lastInitial = nameParts[nameParts.length - 1]?.charAt(0)

    return (firstInitial + lastInitial).toUpperCase()
  }

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public isEmailVerified: string

  @column({ serializeAs: null })
  public password: string

  @hasMany(() => CheliPost)
  public cheliPosts: HasMany<typeof CheliPost>

  @hasMany(() => UserFollow, { foreignKey: 'followingId', serializeAs: null })
  public followers: HasMany<typeof UserFollow>

  @hasMany(() => UserFollow, { foreignKey: 'followerId', serializeAs: null })
  public following: HasMany<typeof UserFollow>

  @column.dateTime({ autoCreate: true, serialize: formatDateTime })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serialize: formatDateTime })
  public updatedAt: DateTime

  @computed()
  public get cheliPostsCount() {
    return this.cheliPosts?.length
  }

  @computed()
  public get followersCount() {
    return this.followers?.length
  }

  @computed()
  public get followingCount() {
    return this.following?.length
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static generateId(user: User) {
    user.id = uuidv4()
  }
}
