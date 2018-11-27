'use strict'

const Model = use('Model')

class Servicio extends Model {
  user(){
    return this.belongsTo('App/Models/User')
  }

  clientes(){
    return this.belongsToMany('App/Models/Cliente')
      .pivotModel('App/Models/ClienteServicio')
      .withPivot(['id', 'fecha_inicio_descuento', 'fecha_fin_descuento', 'estado', 'vencimiento'])
  }
}

module.exports = Servicio
