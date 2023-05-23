import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import CheliPost from 'App/Models/CheliPost'
import { v4 as uuidv4 } from 'uuid'
import { formatDateTime } from '../../utils/Time'

export default class Cheli extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public imageUrl: number

  @column()
  public sponsor: string

  @column()
  public icon: string

  @column()
  public color: string

  @hasMany(() => CheliPost)
  public cheliPosts: HasMany<typeof CheliPost>

  @column.dateTime({ autoCreate: true, serialize: formatDateTime })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serialize: formatDateTime })
  public updatedAt: DateTime

  @beforeCreate()
  public static generateId(cheli: Cheli) {
    cheli.id = uuidv4()
  }
}
