'use strict'

const Schema = use('Schema')

class SucursalSchema extends Schema {
  up () {
    this.create('sucursales', (table) => {
      table.increments();
      table.timestamps();
      table.string('detalle', 50).notNullable();
      table.string('direccion', 50).nullable();
      table.string('contacto', 50).nullable();
      table.integer('estado',1).defaultTo(1).comment('0: inactivo, 1: activo');
    })
  }

  down () {
    this.drop('sucursales')
  }
}

module.exports = SucursalSchema
