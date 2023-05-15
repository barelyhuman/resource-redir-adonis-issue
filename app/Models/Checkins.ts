import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Checkins extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public startedAt: DateTime

  @column.dateTime()
  public endedAt: DateTime

  @column()
  public duration: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
