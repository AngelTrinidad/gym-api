'use strict'

const Model = use('Model')

class Caja extends Model {

  static get createdAtColumn(){
      return null;
  }

  static get updatedAtColumn(){
      return null;
  }

  aperturaCaja(){
    return this.hasMany('App/Models/AperturaCaja')
  }

  sucursal(){
    return this.belongsTo('App/Models/Sucursal')
  }

}

module.exports = Caja
