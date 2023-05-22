import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class UserFollow extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public followerId: string

  @belongsTo(() => User, { foreignKey: 'followerId' })
  public follower: BelongsTo<typeof User>

  @column()
  public followingId: string

  @belongsTo(() => User, { foreignKey: 'followerId' })
  public following: BelongsTo<typeof User>

  @column()
  public isAccepted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
