'use strict'

const Model = use('Model')

class AperturaCaja extends Model {

  static get table () {
    return 'apertura_caja'
  }

  static get createdAtColumn(){
      return null;
  }

  static get updatedAtColumn(){
      return null;
  }

  caja(){
    return this.belongsTo('App/Models/Caja')
  }

  user(){
    return this.belongsTo('App/Models/User')
  }

  movimientoCaja(){
    return this.hasMany('App/Models/MovimientoCaja')
  }

}

module.exports = AperturaCaja
