'use strict'

const Schema = use('Schema')

class ProductoSucursalSchema extends Schema {
  up () {
    this.create('producto_sucursal', (table) => {
      table.increments()
      table.timestamps()
      table.integer('cantidad').notNullable().defaultTo(0)
      table.integer('cantidad_minima').nullable().defaultTo(0)
      table.integer('producto_id').unsigned().references('id').inTable('productos')
      table.integer('sucursal_id').unsigned().references('id').inTable('sucursales')
    })
  }

  down () {
    this.drop('producto_sucursal')
  }
}

module.exports = ProductoSucursalSchema
