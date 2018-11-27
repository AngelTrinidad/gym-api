'use strict'

const Schema = use('Schema')

class ClienteSchema extends Schema {
  up () {
    this.create('clientes', (table) => {
      table.increments();
      table.string('nro_documento', 20).notNullable().unique();
      table.string('nombre', 50).notNullable();
      table.string('apellido', 50).notNullable();
      table.integer('sexo', 1).comment('Hombre: 1, Mujer: 0');
      table.string('email', 25).nullable();
      table.string('contacto', 25).nullable();
      table.date('fecha_nacimiento').nullable();
      table.string('password', 60).nullable();
      table.integer('sucursal_id').unsigned().references('id').inTable('sucursales');
      table.integer('user_id_alta').unsigned().references('id').inTable('users');
      table.timestamps();
    })
  }

  down () {
    this.drop('clientes')
  }
}

module.exports = ClienteSchema
