import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Team from 'App/Models/Team'
import User from 'App/Models/User'
import Project from 'App/Models/Project'

export enum ROLE {
  ADMIN,
  OWNER,
  MEMBER,
  GUEST,
}

// Arc table to handle stable polymorphic relationships
export default class Membership extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public teamId: number

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>

  @column()
  public projectId: number

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @column()
  public role: ROLE

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
