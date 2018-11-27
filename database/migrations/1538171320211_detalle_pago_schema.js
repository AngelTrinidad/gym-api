'use strict'

const Schema = use('Schema')

class DetallePagoSchema extends Schema {
  up () {
    this.create('detalle_pago', (table) => {
      table.increments()
      table.timestamps()
      table.integer('pago_id').unsigned().references('id').inTable('pagos');
      table.integer('servicio_id').unsigned().nullable().references('id').inTable('servicios');
      table.integer('producto_id').unsigned().nullable().references('id').inTable('productos');
      table.integer('monto_total').notNullable();
      table.integer('monto_pagado').notNullable();
      table.integer('monto_descuento').notNullable();
      table.integer('cantidad').notNullable();
    })
  }

  down () {
    this.drop('detalle_pago')
  }
}

module.exports = DetallePagoSchema
