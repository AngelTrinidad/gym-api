'use strict'

const Model = use('Model')

class Ingreso extends Model {

  alerta(){
    return this.hasOne('App/Models/Alerta')
  }

  sucursal(){
    return this.belongsTo('App/Models/Sucursal')
  }


}

module.exports = Ingreso
