import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'chelis'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().unique().primary()
      table.string('title').notNullable().unique()
      table.string('description').notNullable()

      table.string('image_url').nullable()
      table.string('sponsor').nullable()

      table.string('icon').nullable()
      table.string('color').nullable()

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
