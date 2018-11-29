'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('nombre', 30).notNullable();
      table.string('apellido', 30).notNullable();
      table.integer('estado',1).defaultTo(1).comment('Activo: 1, Inactivo: 0')
      table.integer('sucursal_id').unsigned().references('id').inTable('sucursales')
      table.string('cod_confirmacion', 500).nullable()
      table.string('img_perfil', 255).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
