'use strict'

const Schema = use('Schema')

class PagoSchema extends Schema {
  up () {
    this.create('pagos', (table) => {
      table.increments();
      table.timestamps();
      table.date('fecha_pago').notNullable();
      table.text('observacion').nullable();
      table.integer('estado', 1).defaultTo(1).comment('Pago Total: 1, Pago Parcial: 0');
      table.integer('cliente_id').unsigned().references('id').inTable('clientes');
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('sucursal_id').unsigned().references('id').inTable('sucursales');
    })
  }

  down () {
    this.drop('pagos')
  }
}

module.exports = PagoSchema
