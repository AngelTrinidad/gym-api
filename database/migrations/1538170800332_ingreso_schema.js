'use strict'

const Schema = use('Schema')

class IngresoSchema extends Schema {
  up () {
    this.create('ingresos', (table) => {
      table.increments();
      table.timestamps();
      table.integer('cliente_id').unsigned().references('id').inTable('clientes');;
      table.integer('sucursal_id').unsigned().references('id').inTable('sucursales');
    })
  }

  down () {
    this.drop('ingresos')
  }
}

module.exports = IngresoSchema
