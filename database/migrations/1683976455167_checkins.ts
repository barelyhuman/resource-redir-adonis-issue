import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'checkins'

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id')

      table.timestamp('started_at')
      table.timestamp('ended_at')
      table.integer('duration').unsigned()

      table.integer("user_id").references("id").inTable("users").onDelete("CASCADE")


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
