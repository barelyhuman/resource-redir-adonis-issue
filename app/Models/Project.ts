import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  BelongsTo,
  belongsTo,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Team from 'App/Models/Team'
import Membership from 'App/Models/Membership'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public teamId: number

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>

  @hasMany(() => Membership)
  public members: HasMany<typeof Membership>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
