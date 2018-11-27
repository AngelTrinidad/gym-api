'use strict'

const Servicio = use('App/Models/Servicio')

class ServicioController {

  async alta({request, response, auth}){
    /*
    *Descripcion: Alta de un nuevo servicio
    *Header: Authorization: bearer <<token>>
    *Body: servicio.detalle, servicio.precio
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/servicio
    *   }
    * }
    */

    try {

      //user alta
      const user = await auth.getUser()

      //Servicio enviado por el body
      const {servicio} = request.all()

      //Validacion del servicio
      if(!servicio.detalle || !servicio.precio){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Creación del servicio
      const servicioInstance = new Servicio()
      servicioInstance.detalle = servicio.detalle
      servicioInstance.precio = servicio.precio
      servicioInstance.user_id_alta = user.id


      await servicioInstance.save()

      //Success
      return response.json({
        status: "ok",
        body: {
          servicio: servicioInstance
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
    *Descripcion: Modificar un servicio
    *Header: Authorization: Beader <<token>>
    *Body: servicio.id, servicio.detalle, servicio.precio
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

      //Servicio enviado por el body
      const {servicio} = request.all()

      //Validacion de la sucursal
      if(!servicio.id || !servicio.detalle || !servicio.precio){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Creación de servicio
      const servicioInstance = await Servicio.find(servicio.id)
      if(!servicioInstance){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Servicio no encontrado'
          }
        })
      }
      servicioInstance.detalle = servicio.detalle
      servicioInstance.direccion = servicio.precio
      await servicioInstance.save()

      //Success
      return response.json({
        status: "ok",
        body: {
          servicio: servicioInstance
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
    *Descripcion: Inactivacion de un servicio
    *Header: Authorization
    *Body: servicio_id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/servicio
    *   }
    * }
    */

    try {

      //Validación del request
      const idServicio = request.input('servicio_id');
      if(!idServicio){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Modifcación de estado
      const servicio = await this.cambiarEstado(idServicio, 0);
      if(!servicio){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Servicio no encontrado'
          }
        })
      }

      //Success
      return response.json({
        status: "ok",
        body: {
          servicio
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
    *Descripcion: Reactivación de servicio
    *Header: Authorization
    *Body: servicio_id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/user
    *   }
    * }
    */

    try {
      //Validación del request
      const idServicio = request.input('servicio_id');
      if(!idServicio){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Modifcación de estado
      const servicio = await this.cambiarEstado(idServicio, 1);
      if(!idServicio){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Servicio no encontrado'
          }
        })
      }

      //Success
      return response.json({
        status: "ok",
        body: {
          servicio
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

  async cambiarEstado(idServicio, nuevoEstado){

    //Obtenemos el servicio por el id
    const servicio = await Sucursal.find(idServicio)

    //Validación del servicio
    if(!servicio){
      return false
    }

    //Cambiamos el estado
    servicio.estado = nuevoEstado
    await servicio.save()
    return servicio
  }

  async eliminar({request, response}){
    /*
    *Descripcion: Eliminar servicio
    *Header: Authorization: bearer <<token>>
    *Body: servicio.id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/servicio
    *   }
    * }
    */

    try {

      //Validación del request
      const idServicio = request.input('servicio_id');
      if(!idServicio){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Validación de user
      const servicio = await Servicio.find(idServicio)
      if(!servicio){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Servicio no encontrado'
          }
        })
      }

      //Eliminación de servicio
      await servicio.delete()

      //Success
      return response.json({
        status: "ok",
        body: {
          servicio
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

module.exports = ServicioController
