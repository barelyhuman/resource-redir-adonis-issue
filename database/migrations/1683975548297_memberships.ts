import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'memberships'

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id')

      table
        .integer('project_id')
        .unsigned()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')

      table
        .integer('team_id')
        .unsigned()
        .references('id')
        .inTable('teams')
        .onDelete('CASCADE')

      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.integer('role').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
