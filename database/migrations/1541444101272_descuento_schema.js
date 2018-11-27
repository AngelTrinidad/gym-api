'use strict'

const Schema = use('Schema')

class DescuentoSchema extends Schema {
  up () {
    this.create('descuentos', (table) => {
      table.increments()
      table.timestamps()
      table.string('descripcion').notNullable()
      table.float('porcentaje_descuento').nullable()
      table.integer('monto_descuento').nullable()
      table.integer('estado',1).defaultTo(1).comment('0: inactivo, 1: activo')
      table.date('fecha_inicio').nullable()
      table.date('fecha_fin').nullable()
      table.integer('user_id').unsigned().references('id').inTable('users')
    })
  }

  down () {
    this.drop('descuentos')
  }
}

module.exports = DescuentoSchema
