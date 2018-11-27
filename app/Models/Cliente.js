'use strict'

const Model = use('Model')

class Cliente extends Model {

  static get hidden () {
   return ['password']
  }

  sucursal(){
    return this.belongsTo('App/Models/Sucursal')
  }

  ingresos(){
    return this.hasMany('App/Models/Ingreso')
  }

  adminAlta(){
    return this.hasOne('App/Models/Admin')
  }

  servicios(){
    return this.belongsToMany('App/Models/Servicio')
      .pivotModel('App/Models/ClienteServicio')
      .withPivot(['id', 'fecha_inicio_descuento', 'fecha_fin_descuento', 'estado', 'vencimiento'])
  }

  ingresos(){
    return this.hasMany('App/Models/Ingreso')
  }


}

module.exports = Cliente
