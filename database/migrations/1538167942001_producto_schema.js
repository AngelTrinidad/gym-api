'use strict'

const Schema = use('Schema')

class ProductoSchema extends Schema {
  up () {
    this.create('productos', (table) => {
      table.increments();
      table.string('detalle', 50).notNullable();
      table.integer('estado', 1).defaultTo(1).comment('Activo: 1, Inactivo: 0');
      table.integer('precio').notNullable();
      table.integer('user_id_alta').unsigned().references('id').inTable('users')
      table.string('img', 255).nullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('productos')
  }
}

module.exports = ProductoSchema
