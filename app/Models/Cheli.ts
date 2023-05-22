import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import CheliPost from 'App/Models/CheliPost'

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}