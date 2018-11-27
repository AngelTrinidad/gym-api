'use strict'

const User = use('App/Models/User')
const Cliente = use('App/Models/Cliente')
const Sucursal = use('App/Models/Sucursal')

class SucursalController {

  async alta({request, response}){
    /*
    *Descripcion: Alta de una nueva sucursal
    *Header: Authorization: bearer <<token>>
    *Body: sucursal.detalle, sucursal.direccion, sucursal.contacto
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/sucursal
    *   }
    * }
    */

    try {

      //Sucursal enviado por el body
      const {sucursal} = request.all()

      //Validacion de la sucursal
      if(!sucursal.detalle){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Creación de la sucursal
      const sucursalInstance = new Sucursal()
      sucursalInstance.detalle = sucursal.detalle
      sucursalInstance.direccion = (sucursal.direccion ? sucursal.direccion : null)
      sucursalInstance.contacto = (sucursal.contacto ? sucursal.contacto : null)


      await sucursalInstance.save()

      //Success
      return response.json({
        status: "ok",
        body: {
          sucursal: sucursalInstance
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
    *Descripcion: Modificar de sucursal
    *Header: Authorization: Beader <<token>>
    *Body: sucursal.id, sucursal.detalle, sucursal.direccion, sucursal.contacto
    *Formato: obj
    *Return:
    *  {
    *    status: ok/error,
    *    body: {
    *     msg/sucursal
    *    }
    *  }
    */

    try {

      //Sucursal enviado por el body
      const {sucursal} = request.all()

      //Validacion de la sucursal
      if(!sucursal.id || !sucursal.detalle){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Creación de la sucursal
      const sucursalInstance = await Sucursal.find(sucursal.id)
      if(!sucursalInstance){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Sucursal no encontrado'
          }
        })
      }
      sucursalInstance.detalle = sucursal.detalle
      sucursalInstance.direccion = (sucursal.direccion ? sucursal.direccion : null)
      sucursalInstance.contacto = (sucursal.contacto ? sucursal.contacto : null)
      await sucursalInstance.save()

      //Success
      return response.json({
        status: "ok",
        body: {
          sucursal: sucursalInstance
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

  async cambiarEstado({request, response}){
    /*
    *Descripcion: Inactivacion de un usuario
    *Header: Authorization: bearer <<token>>
    *Body: user_id
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
      const idSucursal = request.input('sucursal_id');
      if(!idSucursal){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Obtenemos el user por el id
      const sucursal = await Sucursal.find(idSucursal)

      //Validación del user id
      if(!sucursal){
        return response.json({
          status: "error",
          body: {
            msg: 'Sucursal no encontado'
          }
        })
      }

      //Cambiamos el estado
      sucursal.estado = !sucursal.estado
      await sucursal.save()

      //Success
      return response.json({
        status: "ok",
        body: {
          sucursal
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

  async eliminar({request, response}){
    /*
    *Descripcion: Eliminar sucursal
    *Header: Authorization: bearer <<token>>
    *Body: sucursal_id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/sucursal
    *   }
    * }
    */

    try {

      //Validación del request
      const idSucursal = request.input('sucursal_id');
      if(!idSucursal){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Validación de user
      const sucursal = await Sucursal.find(idSucursal)
      if(!sucursal){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Sucursal no encontrado'
          }
        })
      }

      //Eliminación de sucursal
      await sucursal.delete()

      //Success
      return response.json({
        status: "ok",
        body: {
          sucursal
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

  async all({response}){
    /*
    *Descripcion: Listado de sucursales activos
    *Header: Authorization: Beader <<token>>
    *Body: ---
    *Formato: obj
    *Return:
    *  {
    *    status: ok/error,
    *    body: {
    *     msg/sucursales
    *    }
    *  }
    */

    try {

      //listado de sucursales
      const sucursales = await Sucursal
        .query()
        .select('id', 'detalle', 'direccion', 'contacto', 'created_at as fecha_creacion', 'estado')
        .fetch()

      //Success
      return response.json({
        status: "ok",
        body: {
          sucursales
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

module.exports = SucursalController
