'use strict'

const Model = use('Model')

class Producto extends Model {
  userAlta(){
    return this.belongsTo('App/Models/User', 'id', 'id')
  }

  sucursales(){
    return this
      .belongsToMany('App/Models/Sucursal', 'producto_id', 'sucursal_id')
      .withPivot(['cantidad', 'cantidad_minima'])
  }

}

module.exports = Producto
