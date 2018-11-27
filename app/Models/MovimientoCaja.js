'use strict'

const Model = use('Model')

class MovimientoCaja extends Model {

  static get table () {
    return 'movimiento_caja'
  }

  detallePago(){
    return this.belongsTo('App/Models/DetallePago')
  }

}

module.exports = MovimientoCaja
