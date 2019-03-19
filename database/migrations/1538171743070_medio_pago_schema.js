'use strict'

const Schema = use('Schema')

class MedioPagoSchema extends Schema {
  up () {
    this.create('medio_pago', (table) => {
      table.increments();
      table.timestamps();
      table.string('detalle').notNullable();
      table.integer('estado', 1).defaultTo(1);
    })
  }

  down () {
    this.drop('medio_pago')
  }
}

module.exports = MedioPagoSchema
