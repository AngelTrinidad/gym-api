'use strict'

const Schema = use('Schema')

class LoginUserSchema extends Schema {
  up () {
    this.create('login_user', (table) => {
      table.increments();
      table.timestamps();
      table.integer('user_id').unsigned().references('id').inTable('users');
    })
  }

  down () {
    this.drop('login_user')
  }
}

module.exports = LoginUserSchema
