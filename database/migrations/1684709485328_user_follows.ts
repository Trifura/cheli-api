import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_follows'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('follower_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('following_id').references('id').inTable('users').onDelete('CASCADE')
      table.boolean('is_accepted').defaultTo(false)
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
