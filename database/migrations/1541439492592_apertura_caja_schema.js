'use strict'

const Schema = use('Schema')

class AperturaCajaSchema extends Schema {
  up () {
    this.create('apertura_caja', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.date('fecha_apertura').notNullable()
      table.time('hora_apertura').notNullable()
      table.timestamp('fecha_aperta_registro')
      table.integer('monto_apertura').defaultTo(0)
      table.date('fecha_cierre').notNullable()
      table.time('hora_cierre').notNullable()
      table.timestamp('fecha_cierre_registro')
      table.integer('monto_cierre').defaultTo(0)
      table.integer('monto_diferencia').nullable()
      table.integer('caja_id').unsigned().references('id').inTable('cajas')

    })
  }

  down () {
    this.drop('apertura_caja')
  }
}

module.exports = AperturaCajaSchema
