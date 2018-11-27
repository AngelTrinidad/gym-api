'use strict'

const Model = use('Model')

class Pago extends Model {

  cliente(){
    return this.belongsTo('App/Models/Cliente')
  }

  user(){
    return this.belongsTo('App/Models/User')
  }

  DetallePago(){
    return this.hasMany('App/Models/DetallePago')
  }

}

module.exports = Pago
