'use strict'

const Schema = use('Schema')

class CajaSchema extends Schema {
  up () {
    this.create('cajas', (table) => {
      table.increments();
      table.integer('sucursal_id').unsigned().references('id').inTable('sucursales');
      table.string('detalle', 25).notNullable();
    })
  }

  down () {
    this.drop('cajas')
  }
}

module.exports = CajaSchema
