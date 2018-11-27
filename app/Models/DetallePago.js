'use strict'

const Model = use('Model')

class DetallePago extends Model {

  static get table () {
    return 'detalle_pago'
  }

  servicio(){
    return this.hasOne('App/Models/Servicio')
  }

  producto(){
    return this.hasOne('App/Models/Producto')
  }

  medioPagos(){
    return this.belongsToMany('App/Models/MedioPago')
      .pivotTable('medio_pago_detalle_pago')
  }

}

module.exports = DetallePago
