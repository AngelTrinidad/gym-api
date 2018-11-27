'use strict'

const Model = use('Model')

class Sucursal extends Model {

  static get table () {
    return 'sucursales'
  }

  productos(){
    return this.belongsToMany('App/Models/Producto')
      .pivotTable('producto_sucursal')
  }

  cajas(){
    return this.hasMany('App/Models/Caja')
  }
}

module.exports = Sucursal
