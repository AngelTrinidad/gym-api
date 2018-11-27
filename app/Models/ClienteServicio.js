'use strict'

const Model = use('Model')

class ClienteServicio extends Model {
  static get table(){
    return 'cliente_servicio'
  }

  user(){
    return this.hasOne('App/Models/User')
  }
}

module.exports = ClienteServicio
