'use strict'

const Schema = use('Schema')

class ServicioSchema extends Schema {
  up () {
    this.create('servicios', (table) => {
      table.increments();
      table.timestamps();
      table.string('detalle', 50).notNullable();
      table.integer('precio').notNullable();
      table.integer('estado', 1).defaultTo(1).comment('Activo: 1, Inactivo: 0');
      table.integer('user_id_alta').unsigned().references('id').inTable('users');
    })
  }

  down () {
    this.drop('servicios')
  }
}

module.exports = ServicioSchema
