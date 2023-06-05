import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import CheliPost from 'App/Models/CheliPost'
import User from 'App/Models/User'

export default class CheliPostComment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public cheliPostId: string

  @belongsTo(() => CheliPost, { foreignKey: 'cheliPostId' })
  public cheliPost: BelongsTo<typeof CheliPost>

  @column({ serializeAs: null })
  public userId: string

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
