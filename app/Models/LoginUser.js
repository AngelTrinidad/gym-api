'use strict'

const Model = use('Model')

class LoginUser extends Model {
  static get table () {
    return 'login_user'
  }
}

module.exports = LoginUser
