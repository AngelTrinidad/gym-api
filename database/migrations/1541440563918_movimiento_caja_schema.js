'use strict'

const Schema = use('Schema')

class MovimientoCajaSchema extends Schema {
  up () {
    this.create('movimiento_caja', (table) => {
      table.increments()
      table.integer('apertura_caja_id').unsigned().references('id').inTable('apertura_caja')
      table.timestamps()
      table.integer('monto').notNullable()
      table.string('tipo', 1).comment('I: ingreso, E: egreso')
      table.text('observacion').nullable()
      table.integer('detalle_pago_id').unsigned().references('id').inTable('detalle_pago')
    })
  }

  down () {
    this.drop('movimiento_caja')
  }
}

module.exports = MovimientoCajaSchema
