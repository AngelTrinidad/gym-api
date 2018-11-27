'use strict'

const Model = use('Model')

class Descuento extends Model {

  adminAlta(){
    return this.hasOne('App/Models/Admin')
  }

}

module.exports = Descuento
