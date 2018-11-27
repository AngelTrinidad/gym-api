'use strict'

const Descuento = use('App/Models/Descuento')

class DescuentoController {
  async alta({request, response, auth}){
    /*
    *Descripcion: Alta de un nuevo descuento
    *Header: Authorization: bearer <<token>>
    *Body: descuento.descripcion, descuento.porcentaje_descuento, descuento.monto_descuento
    * descuento.fecha_inicio, descuento.fecha_fin
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/descuento
    *   }
    * }
    */

    try {

      //user alta
      const user = await auth.getUser()

      //descuento enviado por el body
      const {descuento} = request.all()

      //Validacion del descuento
      if(!descuento.descripcion || (!descuento.porcentaje_descuento && !descuento.monto_descuento)
          || !descuento.fecha_inicio || !descuento.fecha_fin){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      if(descuento.fecha_fin < descuento.fecha_inicio){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Fecha fin es menor a la fecha de inicio'
          }
        })
      }

      //Creación del descuento
      const descuentoInstance = new Descuento()
      descuentoInstance.descripcion = descuento.descripcion
      descuentoInstance.porcentaje_descuento = (descuento.porcentaje_descuento ? descuento.porcentaje_descuento : null)
      descuentoInstance.monto_descuento = (descuento.monto_descuento ? descuento.monto_descuento : null)
      descuentoInstance.fecha_inicio = descuento.fecha_inicio
      descuentoInstance.fecha_fin = descuento.fecha_fin
      descuentoInstance.user_id = user.id


      await descuentoInstance.save()

      //Success
      return response.json({
        status: "ok",
        body: {
          descuento: descuentoInstance
        }
      })

    } catch (e) {
      //ERROR!!!
      return response.json({
        status: "error",
        body:{
          msg: e
        }
      })
    }
  }

  async modificar({request, response}){
    /*
    *Descripcion: Modificar un descuento
    *Header: Authorization: Beader <<token>>
    *Body: descuento.id, descuento.descripcion, descuento.porcentaje_descuento, descuento.monto_descuento
    * descuento.fecha_inicio, descuento.fecha_fin
    *Formato: obj
    *Return:
    *  {
    *    status: ok/error,
    *    body: {
    *     msg/servicio
    *    }
    *  }
    */

    try {

      //Descuento enviado por el body
      const {descuento} = request.all()

      //Validacion del descuento
      if(!descuento.id || !descuento.descripcion || (!descuento.porcentaje_descuento && !descuento.monto_descuento)
          || !descuento.fecha_inicio || !descuento.fecha_fin){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      if(descuento.fecha_fin < descuento.fecha_inicio){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Fecha fin es menor a la fecha de inicio'
          }
        })
      }

      //Find del descuento
      const descuentoInstance = await Descuento.find(descuento.id)
      if(!descuentoInstance){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Descuento no encontrado'
          }
        })
      }
      descuentoInstance.descripcion = descuento.detalle
      descuentoInstance.porcentaje_descuento = (descuento.porcentaje_descuento ? descuento.porcentaje_descuento : null)
      descuentoInstance.monto_descuento = (descuento.monto_descuento ? descuento.monto_descuento : null)
      descuentoInstance.fecha_inicio = descuento.fecha_inicio
      descuentoInstance.fecha_fin = descuento.fecha_fin
      await descuentoInstance.save()

      //Success
      return response.json({
        status: "ok",
        body: {
          descuento: descuentoInstance
        }
      })


    } catch (e) {
      //ERROR!!!
      return response.json({
        status: "error",
        body:{
          msg: e
        }
      })
    }
  }

  async inactivar({request, response}){
    /*
    *Descripcion: Inactivacion de un descuento
    *Header: Authorization: bearer <<token>>
    *Body: descuento_id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/descuento
    *   }
    * }
    */

    try {

      //Validación del request
      const idDescuento = request.input('descuento_id');
      if(!idDescuento){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Modifcación de estado
      const descuento = await this.cambiarEstado(idDescuento, 0);
      if(!descuento){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Descuento no encontrado'
          }
        })
      }

      //Success
      return response.json({
        status: "ok",
        body: {
          descuento
        }
      })
    } catch (e) {
      //ERROR!!!
      return response.json({
        status: "error",
        body:{
          msg: e
        }
      })
    }

  }

  async reactivar({request, response}){
    /*
    *Descripcion: Reactivación de descuento
    *Header: Authorization: bearer <<token>>
    *Body: descuento_id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/descuento
    *   }
    * }
    */

    try {
      //Validación del request
      const idDescuento = request.input('descuento_id');
      if(!idDescuento){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Modifcación de estado
      const descuento = await this.cambiarEstado(idDescuento, 1);
      if(!descuento){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Descuento no encontrado'
          }
        })
      }

      //Success
      return response.json({
        status: "ok",
        body: {
          descuento
        }
      })
    } catch (e) {
      //ERROR!!
      return response.json({
        status: "error",
        body: {
          e
        }
      })
    }


  }

  async cambiarEstado(idDescuento, nuevoEstado){

    //Obtenemos el descuento por el id
    const descuento = await Descuento.find(idDescuento)

    //Validación del descuento
    if(!descuento){
      return false
    }

    //Cambiamos el estado
    descuento.estado = nuevoEstado
    await descuento.save()
    return descuento
  }

  async eliminar({request, response}){
    /*
    *Descripcion: Eliminar descuento
    *Header: Authorization: bearer <<token>>
    *Body: descuento_id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/descuento
    *   }
    * }
    */

    try {

      //Validación del request
      const idDescuento = request.input('descuento_id');
      if(!idDescuento){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Validación de user
      const descuento = await Descuento.find(idDescuento)
      if(!descuento){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Descuento no encontrado'
          }
        })
      }

      //Eliminación de descuento
      await descuento.delete()

      //Success
      return response.json({
        status: "ok",
        body: {
          descuento
        }
      })
    } catch (e) {
      //ERROR!!!
      return response.json({
        status: "error",
        body:{
          msg: e
        }
      })
    }

  }

  
}

module.exports = DescuentoController
