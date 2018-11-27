'use strict'

const Schema = use('Schema')

class ClienteServicioSchema extends Schema {
  up () {
    this.create('cliente_servicio', (table) => {
      table.increments();
      table.timestamps();
      table.integer('servicio_id').unsigned().references('id').inTable('servicios');
      table.integer('cliente_id').unsigned().references('id').inTable('clientes');
      table.integer('descuento_id').unsigned().references('id').inTable('descuentos');;
      table.date('fecha_inicio_descuento').nullable();
      table.date('fecha_fin_descuento').nullable();
      table.integer('estado', 1).defaultTo(1).comment('Activo: 1, Inactivo: 0');
      table.date('vencimiento').nullable();
    })
  }

  down () {
    this.drop('cliente_servicio')
  }
}

module.exports = ClienteServicioSchema
