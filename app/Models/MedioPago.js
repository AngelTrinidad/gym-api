'use strict'

const Model = use('Model')

class MedioPago extends Model {

  static get table () {
    return 'medio_pago'
  }

  detallePagos(){
    return this.belongsToMany('App/Models/DetallePago')
      .pivotTable('medio_pago_detalle_pago')
  }

}

module.exports = MedioPago
