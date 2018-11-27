'use strict'

const Model = use('Model')

class Producto extends Model {
  userAlta(){
    return this.belongsTo('App/Models/User', 'id', 'id')
  }

  sucursales(){
    return this.belongsToMany('App/Models/Sucursal')
      .pivotTable('producto_sucursal')
  }

}

module.exports = Producto
