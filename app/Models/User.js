'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeCreate', async (userInstance) => {
      if(userInstance.password ){
        userInstance.password = await Hash.make(userInstance.password)
      }
    })

  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */

  static get hidden () {
   return ['password', 'cod_confirmacion']
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  loginUsers(){
    return this.hasMany('App/Models/LoginUser');
  }

  sucursal(){
    return this.belongsTo('App/Models/Sucursal')
  }
}

module.exports = User
