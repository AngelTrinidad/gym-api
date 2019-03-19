'use strict'

const MedioPago = use('App/Models/MedioPago')

class MediosPagoController {
  async cambiarEstado({request, response}){
    /*
    */

    try {

      //Validación del request
      const medioPagoId = request.input('medioPago_id')
      const newState = request.input('new_state')
      if(!medioPagoId){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Obtenemos el medioPago por el id
      const medioPago = await MedioPago.find(medioPagoId)

      //Validación del medioPago
      if(!medioPago){
        return response.json({
          status: "error",
          body: {
            msg: 'medioPago no encontado'
          }
        })
      }

      //Cambiamos el estado
      switch (newState) {
        case 'disable':
            medioPago.estado = 0
          break;
        case 'delete':
            medioPago.estado = 2
          break;
        default:
            medioPago.estado = 1
      }
      await medioPago.save()

      //Success
      return response.json({
        status: "ok",
        body: {
            medioPago
        }
      })
    } catch (e) {
      //ERROR!!!
      return response.json({
        status: "error",
        body:{
          msg: e.message
        }
      })
    }

  }

  async all({response}){
    console.log('ok')
    try {
      const mediosPago = await MedioPago
        .query()
        .where('estado', '<>', 2)
        .orderBy('detalle', 'asc')
        .fetch()
      return response.json({
        status: 'ok',
        body: {
          mediosPago
        }
      })
    } catch (e) {
      return response.json({
        status: 'error',
        body:{
          msg: e.message
        }
      })
    }
  }

  async allEnable({response}){
    try {
      const mediosPago = await MedioPago
        .query()
        .where('estado', '=', 1)
        .orderBy('detalle', 'asc')
        .fetch()
      return response.json({
        status: 'ok',
        body: {
          mediosPago
        }
      })
    } catch (e) {
      return response.json({
        status: 'error',
        body:{
          msg: e.message
        }
      })
    }
  }

}

module.exports = MediosPagoController
