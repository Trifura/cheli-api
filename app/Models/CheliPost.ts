import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import User from 'App/Models/User'
import Cheli from 'App/Models/Cheli'
import { formatDateTime, formatTimeLeft } from '../../utils/Time'
import CheliPostLike from 'App/Models/CheliPostLike'
import CheliPostComment from 'App/Models/CheliPostComment'

export default class CheliPost extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: null })
  public userId: string

  @column({ serializeAs: null })
  public cheliId: string

  @column()
  public isCompleted: boolean

  @column.dateTime({
    autoCreate: true,
    serialize: formatDateTime,
  })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serialize: formatDateTime })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Cheli, { foreignKey: 'cheliId' })
  public cheli: BelongsTo<typeof Cheli>

  @hasMany(() => CheliPostLike, { serializeAs: null })
  public likes: HasMany<typeof CheliPostLike>

  @hasMany(() => CheliPostComment, { serializeAs: null })
  public comments: HasMany<typeof CheliPostComment>

  @computed()
  public get likesCount() {
    return this.likes?.length ?? 0
  }

  @computed()
  public get commentsCount() {
    return this.comments?.length ?? 0
  }

  @computed()
  public get timeLeft() {
    const oneDay = 24 * 60 * 60 * 1000
    const createdAt = this.createdAt.toMillis()
    const currentTime = DateTime.now().toMillis()

    const timePassed = currentTime - createdAt
    return formatTimeLeft(oneDay - timePassed)
  }

  @beforeCreate()
  public static generateId(cheliPost: CheliPost) {
    cheliPost.id = uuidv4()
  }
}
