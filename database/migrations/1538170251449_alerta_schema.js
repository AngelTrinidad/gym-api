'use strict'

const Schema = use('Schema')

class AlertaSchema extends Schema {
  up () {
    this.create('alertas', (table) => {
      table.increments();
      table.string('detalle', 100).notNullable();
    })
  }

  down () {
    this.drop('alertas')
  }
}

module.exports = AlertaSchema
