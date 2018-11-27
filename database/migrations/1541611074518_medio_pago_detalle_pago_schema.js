'use strict'

const Schema = use('Schema')

class MedioPagoDetallePagoSchema extends Schema {
  up () {
    this.create('medio_pago_detalle_pago', (table) => {
      table.increments();
      table.timestamps();
      table.integer('medio_pago_id').unsigned().references('id').inTable('medio_pago');
      table.integer('detalle_pago_id').unsigned().references('id').inTable('detalle_pago');
      table.string('nro_comprobante', 50).nullable();
      table.integer('monto').notNullable();
    })
  }

  down () {
    this.drop('medio_pago_detalle_pago')
  }
}

module.exports = MedioPagoDetallePagoSchema
